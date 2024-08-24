const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.readHandler = async function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Parameters for DynamoDB
    let params = {
        TableName : process.env.TABLE_NAME,
    };

    // Call DynamoDB to get the items from the table
    try {
        const data = await dynamoDB.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.log('Error getting items from table:', error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};