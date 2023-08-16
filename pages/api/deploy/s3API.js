import { RID } from '../../../utils/utils';
import add_s3_api from '../pulumi/programs/add/s3_api'
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const handler = async (req, res) => {
  const { method, body } = req;

  const { apiID, apiName, s3ResourceId, bucketName, rid, executionArn } = body;
  const stackName = `deploy-s3-api-apiID-${apiID}-${RID()}`;
  try {
    if (method === 'POST') {
        const stack = await LocalWorkspace.createStack({
            stackName,
            projectName: 'js-test',
            program: async () =>  await add_s3_api({ apiID, apiName, s3ResourceId, bucketName, rid, executionArn }),
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