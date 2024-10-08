const https = require('https');

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

const requestMongoDBPostRequest = (mongodb_api_key, dbname, requestData) => {
    const data = {
        ...requestData,
        MongoDBName: dbname,
    };

    return new Promise((resolve, reject) => {
        const options = {
            host: 'us-east-1.aws.data.mongodb-api.com',
            path: '/app/data-bhaqy/endpoint/custom/webhub/api/dev',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': mongodb_api_key,
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
    
    
    const { body, headers } = event || {};
    
    // first check that the api-key passed in the header matches the environment variable api-key which is the api-key for webhub
    if (!headers || headers["api-key"] !== process.env.API_KEY) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                headers: event.headers,
                requestMongoDBResult: { type: 'error', message: 'NOT AUTHORIZED: API_KEY not defined or authorized correctly'},
            }),
        };
    }
    
    const bodyObj = parseBody(body);


    // next try to make the mongodb request
    
    const requestMongoDBResult = await requestMongoDBPostRequest(process.env.MONGODB_API_KEY, process.env.MONGODB_NAME, bodyObj)
        .then(responseData => {
            console.log('Response data:', responseData);
            return { type: 'success', result: parseBody(responseData) };
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
            requestMongoDBResult,
        }),
    };
};
