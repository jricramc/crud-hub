import axios from 'axios';
import { sendEmail } from '@/utils/server/apiCalls';
import { RID } from '@/utils/utils';

const handler = async (req, res) => {
  try {
    const { method, body } = req;
    const { email, code } = body;

    if (method === 'POST') {

        const query = { "email": email };

        const requestData = {
            "MongoDBName": "API72_REGISTRY",
            "MongoDB": {
                "root": true,
                "chain": [
                    {
                        "method": ".collection()",
                        "args": [
                            "api72-email-list-registry"
                        ],
                        "chain": [
                            {
                                "method": ".findOne()",
                                "args": [
                                    query,
                                ],
                                "variable": {
                                    "name": "email_list_entry",
                                    "return": true,
                                }
                            }
                        ]
                    },
                ]
            }
        };

        const mongoDBPostRequest = await axios({
            url: 'https://us-east-1.aws.data.mongodb-api.com/app/data-bhaqy/endpoint/custom/webhub/api/dev',
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'api-key': process.env.NEXT_PUBLIC_MONGODB_API_KEY || 'no-api-key',
            },
            data: requestData,
        });

        const handleResponse = async (response) => {
            if (response.status !== 200) {
                return {
                    statusCode: 500,
                    output: { err: true }
                };
            }

            const email_list_entry = response?.data?.response?.variables?.email_list_entry?.value;
            let {
                complete,
                code: correctCode,
                date_verified,
            } = email_list_entry?.verification || {};

            if (!complete && code === correctCode) {
                const query = {
                    $and: [
                        { "email": email },
                        { "verification.code": code },
                    ]
                };

                const $set = {
                    "verification.complete": true,
                    "verification.date_verified": new Date(),
                };

                const requestData2 = {
                    "MongoDBName": "API72_REGISTRY",
                    "MongoDB": {
                        "root": true,
                        "chain": [
                            {
                                "method": ".collection()",
                                "args": [
                                    "api72-email-list-registry"
                                ],
                                "chain": [
                                    {
                                        "method": ".findOneAndUpdate()",
                                        "args": [
                                            query,
                                            { "$set": $set },
                                            // Options: upsert to insert if document doesn't exist, returnOriginal: false to return the updated document
                                            { "upsert": true, "returnNewDocument": true }
                                        ],
                                        "variable": {
                                            "name": "email_list_entry",
                                            "return": true,
                                        }
                                    }
                                ]
                            },
                        ]
                    }
                };
        
                const mongoDBPostRequest2 = await axios({
                    url: 'https://us-east-1.aws.data.mongodb-api.com/app/data-bhaqy/endpoint/custom/webhub/api/dev',
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        'api-key': process.env.NEXT_PUBLIC_MONGODB_API_KEY || 'no-api-key',
                    },
                    data: requestData2,
                });

                const email_list_entry = mongoDBPostRequest2?.data?.response?.variables?.email_list_entry?.value;
                const {
                    date_verified: new_date_verified,
                } = email_list_entry?.verification || {};

                if (new_date_verified) {
                    date_verified = new_date_verified
                }
            }

            return {
                statusCode: 200,
                output: { alreadyVerified: complete, verified: code === correctCode, date_verified },
            }
            
        };

        const { statusCode, output } = await handleResponse(mongoDBPostRequest);

        res.status(statusCode).json({ ...output });

    } else {
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export default handler;
