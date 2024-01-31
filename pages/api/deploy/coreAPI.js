import axios from 'axios';
import core_api_pt_1 from '../pulumi/programs/create/core_api_pt_1';
import core_api_pt_2 from '../pulumi/programs/create/core_api_pt_2';
import core_api_pt_3 from '../pulumi/programs/create/core_api_pt_3';
import { RID } from '../../../utils/utils';
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const handler = async (req, res) => {
  try {
    const { method, body, headers } = req;
    const { email } = body;

    const rid = RID (12);
    const secretRid = RID(12);

    const projectName = `API-72-${rid}`;
    const stackName = `stack-${rid}`;
   
    if (method === 'POST') {

        let statusCode = 400;
        let output = { err: 'bad-request', level: 'err_0' };

        const stack1 = await LocalWorkspace.createStack({
            stackName: `${stackName}-pt-1`,
            projectName,
            program: async () => await core_api_pt_1({ rid }),
        });

        await stack1.workspace.installPlugin("aws", "v4.0.0");
        await stack1.setConfig("aws:region", { value: "us-east-2" });

        const upRes1 = await stack1.up({ onOutput: () => {} })
          .then((upRes) => ({ statusCode: 200, output: upRes.outputs }))
          .catch((err) => ({
            statusCode: 409,
            output: { err, level: 'err_1' }
          }));

        console.log('<<stage 1 complete>>');

        if (upRes1.statusCode === 200 && upRes1.output) {

          const {
            url: { value: api_url },
            apiID: { value: api_id },
            apiKey: { value: api_key },
            apiName: { value: api_name },
            rootResourceId: { value: root_resource_id },
            lam_role: { value: { arn: lam_role_arn }},
            executionArn: { value: execution_arn },
            stripeLayerArn: { value: stripe_layer_arn}
          } = upRes1.output;

          const stack2 = await LocalWorkspace.createStack({
            projectName,
            stackName: `${stackName}-pt-2`,
            program: async () =>  await core_api_pt_2({
                apiID: api_id,
                rootResourceId: root_resource_id,
                rid,
            })
          });

          await stack2.workspace.installPlugin("aws", "v4.0.0");
          await stack2.setConfig("aws:region", { value: "us-east-2" });

          const upRes2 = await stack2.up({ onOutput: () => {} })
            .then((upRes) => ({ statusCode: 200, output: upRes.outputs }))
            .catch((err) => ({
              statusCode: 409,
              output: { err, level: 'err_2' }
            }));

          console.log('<<stage 2 complete>>');

          

          if (upRes2.statusCode === 200 && upRes2.output) {
            const {
              lambdaResourceId: {value: lambda_resource_id },
              dbResourceId: { value: db_resource_id },
              mongodbResourceId: { value: mongodb_resource_id },
              s3ResourceId: { value: s3_resource_id },
              stripeResourceId: { value: stripe_resource_id },
              googleResourceId: { value: google_resource_id },
              sendgridResourceId: { value: sendgrid_resource_id },
              websocketResourceId: { value: websocket_resource_id },
              ec2Instance: { value: ec2_instance },
              ec2CloudfrontDistribution: { value: ec2_cloud_front_distribution }
            } = upRes2.output;

            const data = {
              email,
              r_id: rid,
              secret_rid: secretRid,
              api_url,
              api_id,
              api_key,
              api_name,
              root_resource_id,
              lambda_resource_id,
              db_resource_id,
              mongodb_resource_id,
              s3_resource_id,
              stripe_resource_id,
              google_resource_id,
              websocket_resource_id,
              lam_role_arn,
              execution_arn,
              stripe_layer_arn,
              ec2_instance: {
                id: ec2_instance.id,
                arn: ec2_instance.arn,
                publicDns: ec2_instance.publicDns,
                publicIp: ec2_instance.publicIp,
                tags: ec2_instance.tags,
              },
              ec2_cloud_front_distribution: {
                domainName: ec2_cloud_front_distribution.domainName,
              },
              date_created: new Date(),
            };

            const route = 'ledger/create';
            const ledger_url = `${api_url}${route}`;

            const ledgerRequest = await axios({
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
            }).then(() => {
              return {
                statusCode: 200,
                output: {},
              }
            })
            .catch((err) => {
              return {
                statusCode: 409,
                output: { err, level: 'err_3' }
              };
            })

            if (ledgerRequest.statusCode === 200) {
              console.log('<<stage 2.2 complete>>');

              const stack3 = await LocalWorkspace.createStack({
                projectName,
                stackName: `${stackName}-pt-3`,
                program: async () =>  await core_api_pt_3({
                    apiID: api_id,
                    apiKey: api_key,
                    apiName: api_name,
                    apiUrl: api_url,
                    rootResourceId: root_resource_id,
                    dbResourceId: db_resource_id,
                    mongodbResourceId: mongodb_resource_id,
                    lambdaResourceId: lambda_resource_id,
                    s3ResourceId: s3_resource_id,
                    stripeResourceId: stripe_resource_id,
                    googleResourceId: google_resource_id,
                    sendgridResourceId: sendgrid_resource_id,
                    websocketResourceId: websocket_resource_id,
                    lam_role_arn,
                    executionArn: execution_arn,
                    rid,
                    secretRid,
                    stripeLayerArn: stripe_layer_arn
                })
              });

              await stack3.workspace.installPlugin("aws", "v4.0.0");
              await stack3.setConfig("aws:region", { value: "us-east-2" });

              const upRes3 = await stack3.up({ onOutput: () => {} })
              .then((upRes) => {
                  console.log('<<stage 3 complete>>');
                  return {
                    statusCode: 200,
                    output: upRes?.outputs,
                  };
              }).catch((err) => {
                  return {
                    statusCode: 409,
                    output: { err, level: 'err_4' }
                  };
              });

              statusCode = upRes3.statusCode;

              if (upRes3.statusCode === 200) {
                output = data;
              } else {
                output = upRes3.output;
              }

            } else {
              statusCode = ledgerRequest.statusCode;
              output = ledgerRequest.output;
            }

          } else {
            statusCode = upRes2.statusCode;
            output = upRes2.output;
          }

        } else {
          statusCode = upRes1.statusCode;
          output = upRes1.output;
        }

        res.status(statusCode).json({ ...output });

    } else {
        res.status(405).end(`Method ${method} Not Allowed`);
    }
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
