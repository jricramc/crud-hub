// import AWS from 'aws-sdk';
// import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi"; // ES Modules import

const https = require('https');

const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("@aws-sdk/client-apigatewaymanagementapi");
let CONNECTIONS = {};
let RMS = {};

const WsDocsDB = "WEBSOCKET_DOCS_REGISTRY";


/*
Examples:
    wss://9tn6yisxy0.execute-api.us-east-2.amazonaws.com/dev/
    https://9tn6yisxy0.execute-api.us-east-2.amazonaws.com/dev/@connections
*/

const ENDPOINT = `${process.env.WEBSOCKET_ENDPOINT.replace('wss://', 'https://')}/${process.env.STAGE}/`;
// const ENDPOINT = 'https://rmjvtiqnc4.execute-api.us-east-2.amazonaws.com/dev/';

const client = new ApiGatewayManagementApiClient({ endpoint: ENDPOINT });


// sends one message to one connectionId
const sendToOne = async (id, body) => {
    
    const requestParams = {
        ConnectionId: id,
        Data: Buffer.from(JSON.stringify(body)),
    };
    
    const command = new PostToConnectionCommand(requestParams);
    let res = undefined;
    try {
        res = await client.send(command);
    } catch (error) {
        res = error;
    }
    
    return res;
    
    // try {
    //     await client.postToConnection({
    //     'ConnectionId': id,
    //     'Data': Buffer.from(JSON.stringify(body)),
    //     }).promise();
    // } catch (err) {
    //     console.error(err);
    // }
};
    
// sends the same message to multiple connectionId    
const sendToAll = async (ids, body) => {
    const all = ids.map(i => sendToOne(i, body));
    return Promise.all(all);
};

// send individual message to different connectionIds
const broadcast = async (messages) => {
    return Promise.all(messages.map(({ connectionId, body }) => sendToOne(connectionId, body)));
};

const leave_room = ({ connectionId, rm }) => {
    // given a connectionId it will return an object specifying if the
    // connectionId was in their and a list of connectionIds that were affected
    // by the leave room action
    
    const rm_data = RMS[rm] || {};
    
    const res = {
        // an object of the connectionId that left
        left_room: undefined,
        // an array of the connectionId affected by this action
        affected: undefined,
    };
    
    if (!RMS[rm] || RMS[rm][connectionId]) {
        // if the room doesn't exist or their is no connectionId in that room
        // return empty result
        return res;
    }
    
    // save connectionId data that is about to be deleted
    res.left_room = { connectionId: connectionId, data: RMS[rm][connectionId] }
    // delete connectionId data from room
    delete RMS[rm][connectionId];
    
    res.affected = Object.keys(RMS[rm]);
    
    return res;
    
};

const handleWebsocketDisconnect = async (connectionId) => {

    const rms = Object.keys(CONNECTIONS[connectionId]?.rms || {});
                
    const affected_connectionIds = {};
    
    for (let i = 0; i < rms.length; i += 1) {
        const {
            left_room,
            affected
        } = leave_room({ connectionId, rm: rms[i] });
        
        // if a valid connectionId left the room and there was at least
        // one person affected then we will run the for loop
        if (left_room && affected?.length) {
            for (let c = 0; c < affected.length; c += 1) {
                if (Array.isArray(affected_connectionIds[affected[c]])) {
                    affected_connectionIds[affected[c]].push({
                        rm: rms[i],
                        ...left_room,
                    });
                } else {
                    affected_connectionIds[affected[c]] = [{
                        rm: rms[i],
                        ...left_room,
                    }];
                }
            }
        }
    }

    // lastly iterate through the affected_connectionIds object to
    // create a messages list of the form { connectionId, body } and
    // broadcast the messages
    
    const broadcast_res = await broadcast(Object.entries(affected_connectionIds).map(([ connectionId, messages]) => ({
        connectionId,
        body: {
            broadcast: { $disconnect: messages },
        },
    })))

    // remove connectionId from CONNECTIONS obj
    delete CONNECTIONS[connectionId];

    return {
        broadcast_recipients: affected_connectionIds,
        broadcast_res,
    }

};


const handleWebsocketRequest = async (connectionId, {
    action,
    rm,
    _set,
    _get,
    _leave,
    _notification,
    _disconnect,
    _setdoc,
    _updatedoc,
    _getdoc,
}) => {
    
    // when handling a request you'll have to message sets going out. One being
    // broadcast to all the other connectionIds and one being sent back to the
    // connectionId who made the request
    
    // Broadcast Message keys:  $set, $enter_rm, $leave_rm, $notification
    const broadcastMsg = { };
    
    // Response Message keys:   $set, $enter_rm, $get, $leave_rm, $notification, $error
    const responseMsg = { };

    // You always send out two types of messages
    let broadcast_recipients = [];
    let broadcast_res = undefined;

    let response_res = undefined;

    // make sure that those to variables are set
    if (!action) {
        responseMsg['$error'] = { message: 'improperly formatted request, must have key "action" in request' }
    } else if (_disconnect) {

        // if you disconnect from a websocket you are not allowed to _leave or _set a room
        const disconnect_res = await handleWebsocketDisconnect(connectionId)

        broadcast_recipients = disconnect_res.broadcast_recipients;
        broadcast_res = disconnect_res.broadcast_res;

        broadcastMsg['$disconnect'] = { connectionId: connectionId, message: 'connectionId disconnected from websocket' };
        responseMsg['$disconnect'] = { success: true, message: 'successfully disconnected from websocket' };

    } else {

        // make sure that those to variables are set
        if (!rm) {
            responseMsg['$error'] = { message: 'improperly formatted request, must have key "rm" in request' }
        } else {

            if (_leave) {
                // if you leave a room you are not allowed to _set it
                
                // first check that their in the room they want to leave
                if (RMS[rm] && RMS[rm][connectionId]) {
                    broadcastMsg['$leave_rm'] = { connectionId: connectionId, data: RMS[rm][connectionId], message: 'connectionId left room' };
                    responseMsg['$leave_rm'] = { success: true, data: RMS[rm][connectionId], message: 'successfully left room' };
                    
                    // delete data from RMS object
                    delete RMS[rm][connectionId];
                    
                    // delete data from CONNECTIONS object
                    delete CONNECTIONS[connectionId].rms[rm];
                } else {
                    responseMsg['$leave_rm'] = { success: false, message: 'this connectionId was not found in this room' };
                }
                
            } else if (_set) {
                // first check if this is the first time entering in the room
                let entered_room = false;
                if (!RMS[rm]) {
                    // create room
                    RMS[rm] = {};

                }
                if (!RMS[rm][connectionId]) {
                    broadcastMsg['$enter_rm'] = { connectionId: connectionId, data: _set, message: 'new connectionId entered room' };
                    responseMsg['$enter_rm'] = { success: true, message: 'connectionId entered room' };
                    
                    entered_room = true;
                    
                    // add the room to the connectionId's object of room id
                    if (CONNECTIONS[connectionId]?.rms) {
                        CONNECTIONS[connectionId].rms[rm] = true;
                    }
                    
                }
                
                // next add the data to the room
                RMS[rm][connectionId] = _set;
                
                if (!entered_room) {
                    // don't need to broadcast that the room was set and also entered
                    // into because if it was entered into it had to be set
                    broadcastMsg['$set'] = { connectionId: connectionId, data: _set, message: 'connectionId set room data' };
                }
                
                responseMsg['$set'] = { success: true, message: 'successfuly set room data' };
                    
            }
            
            // the next two commands are dependent on if the connectionId is in the room they are trying to either _get, _notification, _setdoc, _updatedoc
            if (RMS[rm] && RMS[rm][connectionId]) {
                
                // _get has to be after _leave and _set because these commands can
                // change the data in the room the connectionId is trying to get data from
                if (_get) {
                    responseMsg['$get'] = { success: true, data: RMS[rm], message: 'successfully retrieved room data' };
                }
                
                if (_notification) {
                    broadcastMsg['$notification'] = { connectionId: connectionId, data: _notification, message: 'connectionId sent notification in room' };
                    responseMsg['$notification'] = { success: true, message: 'connectionId sent notification in room' };
                }

                let doc = undefined;

                if (_setdoc) {
                    // save doc in mongodb
                    const { doc: d } = await setMongoDBWsDoc(_setdoc.db.mongodb.unique_db_name, rm, _setdoc.doc);

                    if (d) {
                        doc = d;

                        broadcastMsg['$setdoc'] = { connectionId: connectionId, data: doc?.data, message: 'connectionId set doc of room' };
                        responseMsg['$setdoc'] = { success: true, message: 'connectionId set doc of room' };
                    } else {
                        responseMsg['$setdoc'] = { success: false, message: 'error occurred setting doc of room' };
                    }

                    
                } else if (_updatedoc) {

                    // get the full update doc after update changes are added in

                    const { doc: d } = await updateMongoDBWsDoc(_updatedoc.db.mongodb.unique_db_name, rm, _updatedoc.doc);

                    if (d) {
                        doc = d;

                        broadcastMsg['$updatedoc'] = { connectionId: connectionId, data: doc?.data, message: 'connectionId updated doc of room' };
                        responseMsg['$updatedoc'] = { success: true, message: 'connectionId updated doc of room' };
                    } else {
                        responseMsg['$updatedoc'] = { success: false, message: 'error occurred updating doc of room' };
                    }
                }

                if (_getdoc) {
                    let r  = undefined;
                    if (!doc) {
                        // the doc needs to be retrieved from mongodb
                        const { doc: d, result } = await getMongoDBWsDoc(_getdoc.db.mongodb.unique_db_name, rm);
                        doc = d;
                        r = result
                    }

                    if (doc) {
                        responseMsg['$getdoc'] = { success: true, data: doc?.data, message: 'successfully retrieved doc data of room' };
                    } else {
                        responseMsg['$getdoc'] = { success: false, message: 'error occurred retrieving doc data of room', result: r };
                    }
                    
                }
                
            } else {

                if (_get) {
                    responseMsg['$get'] = { success: false, message: 'connectionId not found in room, cannot retrieve room data' };
                }
                
                if (_notification) {
                    responseMsg['$notification'] = { success: false, message: 'connectionId not found in room, cannot send notification' };
                }

                if (_setdoc) {
                    responseMsg['$setdoc'] = { success: false, message: 'connectionId not found in room, cannot set doc' };
                }

                if (_updatedoc) {
                    responseMsg['$updatedoc'] = { success: false, message: 'connectionId not found in room, cannot update doc' };
                }

                if (_getdoc) {
                    responseMsg['$getdoc'] = { success: false, message: 'connectionId not found in room, cannot get doc' };
                }
            }
            
            if (Object.keys(broadcastMsg).length > 0) {
                // there is something to broadcast
                
                // get all the keys of everyone in the room except for the connectionId who made this request
                broadcast_recipients = Object.keys(RMS[rm]).filter((k) => k !== connectionId);
                broadcast_res = await sendToAll(
                    broadcast_recipients,
                    { rm, broadcast: broadcastMsg },
                );
            }

        }

    }

    // and there will always be a response message
    response_res = await sendToOne(connectionId, { rm, connectionId, response: responseMsg });
    
    return {
        broadcast: { rm, ...broadcastMsg },
        broadcast_recipients,
        broadcast_res,
        response: { connectionId, rm, ...responseMsg },
        response_recipient: connectionId,
        response_res,
    }
};

const isBase64 = (str) => {
    try {
        // Check if decoded string is the same as the original string. 
        // If so, it's likely not a valid base64 encoded string.
        return Buffer.from(str, 'base64').toString('base64') === str;
    } catch (e) {
        return false;
    }
};


const parseBody = (body) => {
    if (!body) {
        return
    }

    const type = typeof(body);
    if (type === 'object') {
        return body;
    }
    

    try {
        if (isBase64(body)) {
            const decodedBase64 = Buffer.from(body, 'base64').toString('utf8');
            return JSON.parse(decodedBase64);
            }
        // stringified JSON
        return JSON.parse(body)
    } catch (err) {
            
        

        // url encoded
        const decodedString = Buffer.from(body, 'base64').toString('utf8');
            
        const inputString = decodedString
        
        // Splitting by '&' to get key-value pairs
        const keyValuePairs = inputString.split('&').map(pair => pair.split('='));
                
        // Convert 2D array to object and decode each URL encoding value 
        const resultObject = keyValuePairs.reduce((obj, [key, value]) => {
            obj[key] = decodeURIComponent(value);
            return obj;
        }, {});

        return resultObject;
    }
};

const setMongoDBWsDoc = async (unique_db_name, rm, doc) => {

    const requestData = {
        "MongoDBName": "_",
        "MongoDB": {
            "root": true,
            "chain": [
                {
                    "method": ".collection()",
                    "args": [
                        unique_db_name,
                    ],
                    "chain": [
                        {
                            "method": ".findOneAndUpdate()",
                            "args": [
                                { "rm": rm }, // Filter for the document based on rm_id
                                {
                                    "$set": {
                                        "data": doc,
                                    }
                                }, // Update to set the data property
                                { "upsert": true, "returnNewDocument": true } // Options: upsert to insert if document doesn't exist, returnOriginal: false to return the updated document
                            ],
                            "variable": {
                                "name": "doc_result",
                                "return": true,
                            }
                        }
                    ]
                },
            ]
        }
    }

    const { type, result } = await requestMongoDBAPIPostRequest(
        process.env.API_URL_DOMAIN,
        process.env.API_KEY,
        WsDocsDB,
        requestData
    )
        .then(responseData => {
            console.log('Response data:', responseData);
            return { type: 'success', result: parseBody(responseData) };
        })
        .catch(err => {
            // console.error('Error:', err);
            // throw err; // Re-throw the error to be caught by the Lambda handler
            return { type: 'error', result: { err } };
        });

    // lastly return the results
    return {
        type:  type === 'success' ? (result?.requestMongoDBResult.type || 'error') : type,
        doc: result?.requestMongoDBResult?.result?.response?.variables["doc_result"]?.value
    };

};

const updateMongoDBWsDoc = async (unique_db_name, rm, doc) => {

    const flattenObject = (obj, parentKey = '', separator = '.') => {
        let flattenedObj = {};
    
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let newKey = parentKey ? parentKey + separator + key : key;
    
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    Object.assign(flattenedObj, flattenObject(obj[key], newKey, separator));
                } else {
                    flattenedObj[newKey] = obj[key];
                }
            }
        }
    
        return flattenedObj;
    }
    
    const nestedObj = {
        data: doc
    };
    
    const flattenedObj = flattenObject(nestedObj);
    


    const requestData = {
        "MongoDBName": "_",
        "MongoDB": {
            "root": true,
            "chain": [
                {
                    "method": ".collection()",
                    "args": [
                        unique_db_name
                    ],
                    "chain": [
                        {
                            "method": ".findOneAndUpdate()",
                            "args": [
                                { "rm": rm }, // Filter for the document based on rm_id
                                {
                                    "$set": flattenedObj,
                                }, // Update to set the data property
                                { "upsert": true, "returnNewDocument": true } // Options: upsert to insert if document doesn't exist, returnOriginal: false to return the updated document
                            ],
                            "variable": {
                                "name": "doc_result",
                                "return": true,
                            }
                        }
                    ]
                },
            ]
        }
    }

    const { type, result } = await requestMongoDBAPIPostRequest(
        process.env.API_URL_DOMAIN,
        process.env.API_KEY,
        WsDocsDB,
        requestData
    )
        .then(responseData => {
            console.log('Response data:', responseData);
            return { type: 'success', result: parseBody(responseData) };
        })
        .catch(err => {
            // console.error('Error:', err);
            // throw err; // Re-throw the error to be caught by the Lambda handler
            return { type: 'error', result: { err } };
        });

    // lastly return the results
    return {
        type:  type === 'success' ? (result?.requestMongoDBResult.type || 'error') : type,
        doc: result?.requestMongoDBResult?.result?.response?.variables["doc_result"]?.value
    };

};

const getMongoDBWsDoc = async (unique_db_name, rm) => {

    const requestData = {
        "MongoDBName": "_",
        "MongoDB": {
            "root": true,
            "chain": [
                {
                    "method": ".collection()",
                    "args": [
                        unqiue_db_name,
                    ],
                    "chain": [
                        {
                            "method": ".findOneAndUpdate()",
                            "args": [
                                { "rm": rm }, // Filter for the document based on rm_id
                                {
                                    "$set": {
                                        "rm": rm,
                                    }
                                }, // Update to set the data property
                                { "upsert": true, "returnNewDocument": true } // Options: upsert to insert if document doesn't exist, returnOriginal: false to return the updated document
                            ],
                            "variable": {
                                "name": "doc_result",
                                "return": true,
                            }
                        }
                    ]
                },
            ]
        }
    }

    const { type, result } = await requestMongoDBAPIPostRequest(
        process.env.API_URL_DOMAIN,
        process.env.API_KEY,
        WsDocsDB,
        requestData
    )
        .then((responseData) => {
            console.log('Response data:', responseData);
            return { type: 'success', result: parseBody(responseData) };
        })
        .catch((...err) => {
            // console.error('Error:', err);
            // throw err; // Re-throw the error to be caught by the Lambda handler
            return { type: 'error', result: { err } };
        });

    // lastly return the results
    return {
        type:  type === 'success' ? (result?.requestMongoDBResult.type || 'error') : type,
        doc: result?.requestMongoDBResult?.result?.response?.variables["doc_result"]?.value,
        result,
    };

};

const requestMongoDBAPIPostRequest = (api_url_domain, api_key, unique_db_name, requestData) => {
    const data = {
        ...requestData,
    };

    return new Promise((resolve, reject) => {
        const options = {
            host: api_url_domain,
            path: `/v3/db/mongodb/${unique_db_name}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': api_key,
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve(responseData, req); // Resolve with the complete response data
            });
        });

        req.on('error', (e) => {
            reject(req, options);
        });

        req.write(JSON.stringify(data));
        req.end();
    });
};


exports.handler = async (event, context) => {
    let res = undefined;
    
    if (event?.requestContext) {
        const {
            requestContext : { connectionId, routeKey },
            body: bdy,
        } = event;
        
        const body = parseBody(bdy || {});
        
        
    
        switch (routeKey) {
            case '$connect':
                // add connectionId to CONNECTIONS object
                if (connectionId) {
                    CONNECTIONS[connectionId] = { rms: {} };
                }
                
                break;
            case '$disconnect':
                
                res = await handleWebsocketDisconnect(connectionId);
    
                break;
            case '$default':
                res = await handleWebsocketRequest(connectionId, body);
                
                break;
        }
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({ res, CONNECTIONS, RMS, ENDPOINT })
    };
    
};