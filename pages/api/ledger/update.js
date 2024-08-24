import axios from 'axios';

const handler = async (req, res) => {
  try {
    const { method, body, headers } = req;
    const { query, $set } = body;

    if (headers['ledger-api-key'] === process.env.NEXT_PUBLIC_LEDGER_API_KEY) {

        if (method === 'POST') {

            const requestData = {
                "MongoDBName": "API72_REGISTRY",
                "MongoDB": {
                    "root": true,
                    "chain": [
                        {
                            "method": ".collection()",
                            "args": [
                                "api72-ledger-registry"
                            ],
                            "chain": [
                                {
                                    "method": ".findOneAndUpdate()",
                                    "args": [
                                        query,
                                        {
                                            "$set": $set,
                                        }, // Update to set the data property
                                        { "upsert": true, "returnNewDocument": true } // Options: upsert to insert if document doesn't exist, returnOriginal: false to return the updated document
                                    ],
                                    "variable": {
                                        "name": "doc_result",
                                        "return": true,
                                    }
                                }
                            ]
                        },
                    ]
                }
            }

            const { statusCode, output } = await axios({
                url: 'https://us-east-1.aws.data.mongodb-api.com/app/data-bhaqy/endpoint/custom/webhub/api/dev',
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'api-key': process.env.NEXT_PUBLIC_MONGODB_API_KEY || 'no-api-key',
                },
                data: requestData,

                }).then((response) => {
                    return {
                        statusCode: 200,
                        output: { ...(response?.data || {}) },
                    }
                })
                .catch((err) => {
                    return {
                        statusCode: 409,
                        output: { err }
                    };
                })

            // console.log('output: ', JSON.stringify(output)) 
    
            res.status(statusCode).json({ ...output });
    
        } else {
            res.status(405).end(`Method ${method} Not Allowed`);
        }

    } else {
        res.status(405).end(`Not Allowed: api-key incorrect`);
    }
  } catch (error) {
    console.error(error);
    if (error.message.includes('already exists')) {
        res.status(409).send(`stack '${stackName}' already exists`);
    } else {
        res.status(500).send(error.message);
    }
  }
};

export default handler;
