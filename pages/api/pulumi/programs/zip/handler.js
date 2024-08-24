const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

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

exports.createHandler = async function(event, context) {
    // console.log('Received event:', JSON.stringify(event, null, 2));
    const bodyObj = parseBody(event.body, event.isBase64Encoded);

    let id = bodyObj.id;
    let name = bodyObj.name;

    // Parameters for DynamoDB
    let params = {
        TableName : process.env.TABLE_NAME,
        Item: {
            id: id,
            name: name
        }
    };

    // Call DynamoDB to add the item to the table
    try {
        const data = await dynamoDB.put(params).promise();
        console.log('Item added to table:', data);
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.log('Error adding item to table:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error, event, bodyObj}),
        };
    }
};
