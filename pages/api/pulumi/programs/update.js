
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.updateHandler = async function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get id and name from the event body
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
    console.log('Decoded body:', decodedBody);

    // Parse the decoded JSON string into a JSON object
    const bodyObj = JSON.parse(decodedBody);
    console.log('Parsed body object:', bodyObj);

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
