import axios from 'axios';

const handler = async (req, res) => {
  try {
    const { method, body } = req;
    const { query } = body;

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
                                "method": ".findOne()",
                                "args": [
                                    query,
                                ],
                                "variable": {
                                    "name": "ledger_entry",
                                    "return": true
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
                const { api_username } = response?.data?.response?.variables?.ledger_entry?.value?.data || {};
                return {
                    statusCode: 200,
                    output: { verified: !!api_username, api_username },
                }
            })
            .catch((err) => {
                return {
                    statusCode: 409,
                    output: { err, verified: false }
                };
            });

        res.status(statusCode).json(output);

    } else {
        res.status(405).end(`Method ${method} Not Allowed`);
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
