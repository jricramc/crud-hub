import axios from 'axios';

import crud_api from './pulumi/programs/crud_api'
import crud_dynamic_endpoints from './pulumi/programs/crud_dynamic_endpoints';
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const handler = async (req, res) => {
  try {
    const url = 'https://ihi0f9ogvg.execute-api.us-west-2.amazonaws.com/default/webhub-generate-code';
    const { method, body, headers } = req;
    const { content, projectName, stackName } = body;
    const pulumiAccessToken = headers.pulumi_access_token;
    process.env.PULUMI_ACCESS_TOKEN = pulumiAccessToken;

    if (method === 'POST') {
        const stack = await LocalWorkspace.createStack({
            stackName: `${stackName}-pt-1`,
            projectName: projectName,
            program: crud_api,
        });
        await stack.workspace.installPlugin("aws", "v4.0.0");
        await stack.setConfig("aws:region", { value: "us-east-2" });
        const upRes1 = await stack.up({ onOutput: console.log });

        const {
          outputs: {
            apiID: { value: api_id },
            rootResourceId: { value: root_resource_id },
            dbResourceId: { value: db_resource_id },
            lam_role: { value: { arn: lam_role_arn }},
            executionArn: { value: execution_arn },
            rid: { value: r_id },
          }
        } = upRes1;

        const stack2 = await LocalWorkspace.createStack({
          stackName: `${stackName}-pt-2`,
          projectName: projectName,
          program: async () =>  await crud_dynamic_endpoints({
            apiID: api_id,
            rootResourceId: root_resource_id,
            dbResourceId: db_resource_id,
            lam_role_arn,
            executionArn: execution_arn,
            rid: r_id,
          }),
        });

        const upRes2 = await stack2.up({ onOutput: console.log });

        res.status(200).json({
          stackName,
          upRes: {
            part1: upRes1,
            part2: upRes2,
          },
          api_id,
          root_resource_id,
          db_resource_id,
          lam_role_arn,
          execution_arn,
          r_id,
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