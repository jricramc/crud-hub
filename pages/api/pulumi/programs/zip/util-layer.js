const RID = (l = 8) => {
    const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rid = '';
    for (let i = 0; i < l; i += 1) {
        const r = Math.random() * c.length;
        rid += c.substring(r, r + 1);
    }
    return rid;
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

module.exports = {
    parseBody,
    RID
};
