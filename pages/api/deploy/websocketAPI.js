import { RID } from '@/utils/utils';
import add_websocket_api from '../pulumi/programs/add/websocket_api'
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const handler = async (req, res) => {
  const { method, body, headers } = req;

  const { apiID, apiUrl, apiKey, websocketResourceId, socketName, rid, lam_role_arn } = body;
  const stackName = `add-websocket-api-websocketResourceId-${websocketResourceId}-apiID-${apiID}-${RID()}`;
  try {

    if (method === 'POST') {
        const stack = await LocalWorkspace.createStack({
            stackName,
            projectName: `API-72-${rid}`,
            program: async () =>  await add_websocket_api({ apiUrl, apiKey, socketName, websocketResourceId, rid, lam_role_arn }),
        });
        await stack.workspace.installPlugin("aws", "v4.0.0");
        await stack.setConfig("aws:region", { value: "us-east-2" });
        await stack.up({ onOutput: () => {} }).then((...args) => {
          // console.log("args: ", JSON.stringify(args[0]?.outputs?.websocketAPI || {}));
          res.status(200).json({ type: 'success', ...args });
        }).catch((...args) => {
          // console.log('...args: ', args);
          res.status(200).json({ type: 'error', ...args });
        });
    } else res.status(405).end(`Method ${method} Not Allowed`);
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