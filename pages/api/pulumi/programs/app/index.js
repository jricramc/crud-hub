const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get id and name from the event body
    let id = event.body.id;
    let name = event.body.name;

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
            body: JSON.stringify(error),
        };
    }
};
