const https = require('https');

const parseBody = (body, isBase64Encoded) => {
    if (!body) { 
        return {};
    }

    if (isBase64Encoded) {
        const decodedString = Buffer.from(body, 'base64').toString('utf8');
        try {
            return JSON.parse(decodedString);
        } catch(err) {
            console.error("Error parsing base64 encoded body:", err);
            return {};
        }
    }

    try {
        return JSON.parse(body);
    } catch (err) {
        console.error("Error parsing JSON:", err);
        return {};
    }
};

const requestMongoDBPostRequest = (dbname, requestData) => {
    const data = {
        ...requestData,
        MongoDBName: dbname,
    };
    
    // console.log('data: ', data);

    return new Promise((resolve, reject) => {
        const options = {
            host: 'us-east-1.aws.data.mongodb-api.com',
            path: '/app/data-bhaqy/endpoint/custom/webhub/api/dev',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': '75pQZG2c9zFlpG0g6XCrQCT2BH7fvv1KDYpDJAPUQysxI4Etjrpqvff9n7thEsXP',
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve(responseData); // Resolve with the complete response data
            });
        });

        req.on('error', (e) => {
            reject(e.message);
        });

        req.write(JSON.stringify(data));
        req.end();
    });
};

exports.requestHandler = async function(event, context) {
    // console.log('Received event:', JSON.stringify(event, null, 2));
    const bodyObj = parseBody(event.body, event.isBase64Encoded);

    // first check that the api-key passed in the header matches the environment variable api-key

    // next try to make the mongodb request
    
    const requestMongoDBResult = await requestMongoDBPostRequest(process.env.MONGODB_NAME, bodyObj)
        .then(responseData => {
            console.log('Response data:', responseData);
            return { type: 'success', response: responseData };
        })
        .catch(err => {
            // console.error('Error:', err);
            // throw err; // Re-throw the error to be caught by the Lambda handler
            return { type: 'error', response: err };
        });

    // lastly return the results

    return {
        statusCode: 200,
        body: JSON.stringify({
            bodyObj,
            apiKey: process.env.API_KEY,
            tableName: process.env.MONGODB_NAME,
            requestMongoDBResult,
        }),
    };
};
