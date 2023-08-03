import axios from 'axios';

import crud_api from './pulumi/programs/crud_api'
import crud_dynamic_endpoints from './pulumi/programs/crud_dynamic_endpoints';
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const handler = async (req, res) => {
  try {
    const { method, body, headers } = req;
    const { name, email, rid } = body;

    const projectName = 'js-test';
    const stackName = `stack-${rid}`;
   
    if (method === 'POST') {
        const stack = await LocalWorkspace.createStack({
            stackName: `${stackName}-pt-1`,
            projectName,
            program: async () => await crud_api({ rid }),
        });
        await stack.workspace.installPlugin("aws", "v4.0.0");
        await stack.setConfig("aws:region", { value: "us-east-2" });

        await stack.up({ onOutput: () => {} })
          .then(async (upRes1) => {

          const {
            outputs: {
              url: { value: url },
              apiID: { value: api_id },
              apiName: { value: api_name },
              rootResourceId: { value: root_resource_id },
              dbResourceId: { value: db_resource_id },
              lam_role: { value: { arn: lam_role_arn }},
              executionArn: { value: execution_arn },
            }
          } = upRes1;

          // const data = { 
          //   url, api_id, api_name, root_resource_id, db_resource_id, lam_role_arn, execution_arn, r_id
          // };

          const data = {
            id: api_id, // assuming api_id is a string value for the ID
            name: api_name // assuming api_name is a string value for the name
        };
          const route = 'ledger/create';
          const ledger_url = `${url}${route}`;

          console.log('ledger_url', ledger_url)
          try{
            const response = await axios({
              url: ledger_url,
              method: 'POST',
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
              data: data,
            });
            console.log('body', data);
            console.log('res data', response.data);
          } catch (error) {
            console.error('Error making request:', error.response.data);
          }
          
          const stack2 = await LocalWorkspace.createStack({
            stackName: `${stackName}-pt-2`,
            projectName: projectName,
            program: async () =>  await crud_dynamic_endpoints({
              apiID: api_id,
              apiName: api_name,
              rootResourceId: root_resource_id,
              dbResourceId: db_resource_id,
              lam_role_arn,
              execution_arn,
              r_id,
            })
          }).catch((err) => {
            console.log('err: ', err);
            res.status(409).json({ err })
          });
        }).catch((err) => {
          console.log('err: ', err);
          res.status(409).json({ err })
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