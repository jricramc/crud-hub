const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.deleteHandler = async function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get id and name from the event body
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
        console.log('Decoded body:', decodedBody);

    // Parse the decoded JSON string into a JSON object
    const bodyObj = JSON.parse(decodedBody);
        console.log('Parsed body object:', bodyObj);

    // Get id and name from the parsed JSON object
    let id = bodyObj.id;
    


    // Parameters for DynamoDB
    let params = {
        TableName : process.env.TABLE_NAME,
        Key: {
            "id": id
        }
    };

    // Call DynamoDB to delete the item from the table
    try {
        await dynamoDB.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({message: "Item deleted"}),
        };
    } catch (error) {
        console.log('Error deleting item from table:', error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};
