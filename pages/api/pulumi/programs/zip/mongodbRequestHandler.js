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

exports.handler = async function(event, context) {
    // console.log('Received event:', JSON.stringify(event, null, 2));
    const bodyObj = parseBody(event.body, event.isBase64Encoded);

    // first check that the api-key passed in the header matches the environment variable api-key

    // next try to make the mongodb request

    // lastly return the results

    return {
        statusCode: 200,
        body: JSON.stringify({
            bodyObj,
            apiKey: process.env.API_KEY,
            tableName: process.env.TABLE_NAME,
        }),
    };
};
