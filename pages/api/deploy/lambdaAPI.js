import { RID } from '../../../utils/utils';
import add_lambda_api from '../pulumi/programs/add/lambda_api'
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const handler = async (req, res) => {
  const { method, body, headers } = req;
  // const b = body.apiID ? body : JSON.parse(body);
  const { apiID, apiName,lambdaResourceId, lambdaName, rid, code} = body;
  const stackName = `add-lambda-api--${lambdaResourceId}-apiID-${apiID}-${RID()}`;
  try {
    // console.log('body: ', body)
    // console.log('stackName: ', stackName);
    // console.log('dbname', dbName)
    // console.log("puLUMI_ACCESS_TOKEN: ", process.env.PULUMI_ACCESS_TOKEN)

    if (method === 'POST') {
        const stack = await LocalWorkspace.createStack({
            stackName,
            projectName: 'js-test',
            program: async () =>  await add_lambda_api({  apiID, apiName,lambdaResourceId, lambdaName, rid, code}),
        });
        await stack.workspace.installPlugin("aws", "v4.0.0");
        await stack.setConfig("aws:region", { value: "us-east-2" });
        await stack.up({ onOutput: () => {} }).then((...args) => {
          res.status(200).json({ type: 'success', ...args });
        }).catch((...args) => {
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