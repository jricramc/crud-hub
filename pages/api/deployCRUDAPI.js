import axios from 'axios';

import crud_api from './pulumi/programs/crud_api'
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
            stackName: stackName,
            projectName: projectName,
            program: crud_api,
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