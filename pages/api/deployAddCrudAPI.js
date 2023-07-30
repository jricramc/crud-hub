import { RID } from '../../utils/utils';
import add_crud_api from './pulumi/programs/add_crud_api'
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const handler = async (req, res) => {
  const { method, body, headers } = req;
  // const b = body.apiID ? body : JSON.parse(body);
  const { apiID, apiName, dbResourceId, dbName, rid, executionArn } = body;
  const stackName = `addcrudapi-dbResourceId-${dbResourceId}-apiID-${apiID}-${RID()}`;
  try {
    
    const pulumiAccessToken = headers.pulumi_access_token;
    process.env.PULUMI_ACCESS_TOKEN = pulumiAccessToken;

    console.log('body: ', body)
    console.log('stackName: ', stackName);

    if (method === 'POST') {
        const stack = await LocalWorkspace.createStack({
            stackName,
            projectName: 'js-test',
            program: async () =>  await add_crud_api({ apiID, apiName, dbResourceId, dbName, rid, executionArn }),
        });
        await stack.workspace.installPlugin("aws", "v4.0.0");
        await stack.setConfig("aws:region", { value: "us-east-2" });
        const upRes = await stack.up({ onOutput: console.log });
        console.log('upRes:::::::::::', upRes);

        res.status(200).json({ id: stackName, upRes });
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