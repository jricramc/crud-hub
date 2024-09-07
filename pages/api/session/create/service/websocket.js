import axios from 'axios';

const handler = async (req, res) => {
  try {
    const { method, body, headers } = req;
    const { api_url } = body;

    if (headers['ledger-api-key'] === process.env.NEXT_PUBLIC_LEDGER_API_KEY) {

        if (method === 'POST') {

            console.log('url endpoint: ', `${api_url}create/service/websocket/ws00`);

            const { statusCode, output } = await axios({
                url: `${api_url}create/service/websocket/ws00`,
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                }).then((response) => {
                    const { websocket } = response?.data?.websocketAPILedgerResult || {};
                    console.log('websocket:: ', websocket);
                    return {
                        statusCode: 200,
                        output: { websocket },
                    }
                })
                .catch((err) => {
                    return {
                        statusCode: 409,
                        output: { err }
                    };
                });
    
            res.status(statusCode).json(output);
    
        } else {
            res.status(405).end(`Method ${method} Not Allowed`);
        }

    } else {
        res.status(405).end(`Not Allowed: api-key incorrect`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }

};

export default handler;
