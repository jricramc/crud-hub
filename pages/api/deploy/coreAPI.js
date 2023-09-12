import axios from 'axios';

import core_api_pt_1 from '../pulumi/programs/create/core_api_pt_1'
import core_api_pt_2 from '../pulumi/programs/create/core_api_pt_2';
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

// import getConfig from 'next/config';

// const { publicRuntimeConfig } = getConfig();
const _webhub_db_url = 'https://7lgnkvykt8.execute-api.us-east-2.amazonaws.com'; // publicRuntimeConfig.WEBHUB_DB_URL;

const handler = async (req, res) => {
  try {
    const { method, body, headers } = req;
    const { name, email, rid } = body;

    const projectName = 'crud-test';
    const stackName = `stack-${rid}`;
   
    if (method === 'POST') {
        const stack = await LocalWorkspace.createStack({
            stackName: `${stackName}-pt-1`,
            projectName,
            program: async () => await core_api_pt_1({ rid }),
        });

        await stack.workspace.installPlugin("aws", "v4.0.0");
        await stack.setConfig("aws:region", { value: "us-east-2" });

        await stack.up({ onOutput: () => {} })
          .then(async (upRes1) => {
            console.log('<<stage 1 complete>>')
            const {
              outputs: {
                url: { value: api_url },
                apiID: { value: api_id },
                apiName: { value: api_name },
                rootResourceId: { value: root_resource_id },
                dbResourceId: { value: db_resource_id },
                s3ResourceId: { value: s3_resource_id },
                stripeResourceId: { value: stripe_resource_id },
                googleResourceId: { value: google_resource_id },
                sendgridResourceId: { value: sendgrid_resource_id },
                lam_role: { value: { arn: lam_role_arn }},
                executionArn: { value: execution_arn },
                stripeLayerArn: { value: stripe_layer_arn}
              }
            } = upRes1;

          const data = {
            r_id: rid,
            api_url,
            api_id,
            api_name,
            root_resource_id,
            db_resource_id,
            s3_resource_id,
            stripe_resource_id,
            google_resource_id,
            lam_role_arn,
            execution_arn,
            stripe_layer_arn,
            date_created: new Date(),
          };

          const route = 'ledger/create';
          const ledger_url = `${api_url}${route}`;

          await axios({
            url: ledger_url,
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            data: {
              id: rid,
              name: JSON.stringify(data),
            },
          }).then(async (response_1) => {
            console.log('<<stage 1.1 complete>>')

            const db_data_ = {
              rid,
              email, // assuming api_id is a string value for the ID
              name, // assuming api_name is a string value for the name,
              url: api_url,
            };

            const db_data = {
              id: email,
              name: JSON.stringify(db_data_),
            }

            await axios({
              url: `${_webhub_db_url}/stage/dynamodb/webhubprojects/create`,
              method: 'POST',
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
              data: db_data,
            }).then(async (response_2) => {
              console.log('<<stage 1.2 complete>>')

              const stack2 = await LocalWorkspace.createStack({
                projectName,
                stackName: `${stackName}-pt-2`,
                program: async () =>  await core_api_pt_2({
                  apiID: api_id,
                  apiName: api_name,
                  apiUrl: api_url,
                  rootResourceId: root_resource_id,
                  dbResourceId: db_resource_id,
                  s3ResourceId: s3_resource_id,
                  stripeResourceId: stripe_resource_id,
                  googleResourceId: google_resource_id,
                  sendgridResourceId: sendgrid_resource_id,
                  lam_role_arn,
                  executionArn: execution_arn,
                  rid,
                  stripeLayerArn: stripe_layer_arn
                })
              });

              await stack2.workspace.installPlugin("aws", "v4.0.0");
              await stack2.setConfig("aws:region", { value: "us-east-2" });

              await stack2.up({ onOutput: () => {} }).then((upRes2) => {
                console.log('<<stage 2 complete>>')
                res.status(200).json({
                  upRes: {
                    data,
                    part1: upRes1,
                    part2: upRes2,
                  }
                })
              }).catch((err) => {
                console.log('err_4: ', err);
                res.status(409).json({ err, lvl: 'err_4' })
              });
            }).catch((err) => {

              console.log('err_3: ', err);
              res.status(409).json({ err, lvl: 'err_3' })

            });
          }).catch((err) => {

            console.log('err_2: ', err);
            res.status(409).json({ err, lvl: 'err_2' })

          });
        }).catch((err) => {

          console.log('err_1: ', err);
          res.status(409).json({ err, lvl: 'err_1' })

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