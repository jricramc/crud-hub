const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

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

exports.updateHandler = async function(event, context) {
    // console.log('Received event:', JSON.stringify(event, null, 2));

    const bodyObj = parseBody(event.body);

    // Get id and name from the parsed JSON object
    let id = bodyObj.id;
    let name = bodyObj.name;

    // Parameters for DynamoDB
    let params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "id": id
        },
        UpdateExpression: "set #nm = :n",
        ExpressionAttributeValues: {
            ":n": name
        },
        ExpressionAttributeNames: { // Defining ExpressionAttributeNames
            "#nm": "name"
        },
        ReturnValues: "UPDATED_NEW"
    };

    // Call DynamoDB to update the item in the table
    try {
        await dynamoDB.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({message: "Item updated"}),
        };
    } catch (error) {
        console.log('Error updating item in table:', error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};
