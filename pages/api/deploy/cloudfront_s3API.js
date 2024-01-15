import { RID } from '../../../utils/utils';
import add_cloudfront_s3 from '../pulumi/programs/add/cloudfront_s3'
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const handler = async (req, res) => {
  const { method, body } = req;

  const { name, rid, executionArn } = body;
  const stackName = `deploy-cldfrnt-s3-apiID-${apiID}-${RID()}`;
  try {
    if (method === 'POST') {
        const stack = await LocalWorkspace.createStack({
            stackName,
            projectName: `API-72-${rid}`,
            program: async () =>  await add_cloudfront_s3({ name, rid, executionArn }),
        });

        await stack.workspace.installPlugin("aws", "v4.0.0");
        await stack.setConfig("aws:region", { value: "us-east-2" });
        await stack.up({ onOutput: () => {} }).then((...args) => {
            console.log('args: ', JSON.stringify({ args }));
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