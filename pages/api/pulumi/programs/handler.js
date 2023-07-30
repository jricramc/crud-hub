const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.createHandler = async function(event, context) {
    // console.log('Received event:', JSON.stringify(event, null, 2));

    // // Get id and name from the event body
    // let id = event.body.id;
    // let name = event.body.name;
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





