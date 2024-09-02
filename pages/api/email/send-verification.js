import axios from 'axios';
import { sendEmail } from '@/utils/server/apiCalls';
import { RID } from '@/utils/utils';

const handler = async (req, res) => {
  try {
    const { method, body } = req;
    const { email } = body;

    if (method === 'POST') {
        
        const verificationCode = RID(4);

        const $set = {
            "email": email,
            "verification.code": verificationCode,
            "verification.date_created": new Date(),
        };

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
                                "method": ".findOneAndUpdate()",
                                "args": [
                                    { "email": email },
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
            const { complete, code, date_verified } = email_list_entry?.verification || {};
            if (complete) {
                return {
                    statusCode: 200,
                    output: { alreadyVerified: true, date_verified },
                }
            }

            const verificationURL = `${process.env.NEXT_PUBLIC_WEBHUB_HOST}/auth/register?email=${email}&code=${code}`
            const verificationEmail = {
                subject: "Verify your email address",
                content: `Click the link below or use the verification code to verify your email and finish the registration process.<br><br><a href="${verificationURL}">${verificationURL}</a><br>Vefication code: ${code}<br><br>Happy building!<br>Email us at <a href="mailto:webhubhq@gmail.com">webhubhq@gmail.com</a> with any questions!`,
                email,
            };

            const sendEmailRes = await sendEmail(verificationEmail)

            if (sendEmailRes.status === 200) {
                return {
                    statusCode: 200,
                    output: { emailSent: true },
                }
            }

            return {
                statusCode: 500,
                output: { err: true }
            };
            
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
