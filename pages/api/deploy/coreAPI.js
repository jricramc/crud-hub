import axios from 'axios';
import { randomUsernameGenerator, randomInteger } from '@/utils/utils';
import core_api_pt_1 from '../pulumi/programs/create/core_api_pt_1';
import core_api_pt_2 from '../pulumi/programs/create/core_api_pt_2';
import core_api_pt_3 from '../pulumi/programs/create/core_api_pt_3';
import { RID, randomIntegerID } from '@/utils/utils';
import { createLedgerEntry, sendEmail } from '@/utils/server/apiCalls';
const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const handler = async (req, res) => {
  try {
    const { method, body, headers } = req;
    const { email } = body;

    const API72_LEDGER_ACCESS_ID = RID(32);
    const rid = RID (12);
    const secretRid = RID(12);
    const apiKey = RID(32);

    const projectName = `API-72-${rid}`;
    const stackName = `stack-${rid}`;
   
    if (method === 'POST') {

        let statusCode = 400;
        let output = { err: 'bad-request', level: 'err_0' };

        const stack1 = await LocalWorkspace.createStack({
            stackName: `${stackName}-pt-1`,
            projectName,
            program: async () => await core_api_pt_1({ rid, API72_LEDGER_ACCESS_ID }),
        });

        await stack1.workspace.installPlugin("aws", "v4.0.0");
        await stack1.setConfig("aws:region", { value: "us-east-2" });

        const upRes1 = await stack1.up({ onOutput: () => {} })
          .then((upRes) => ({ statusCode: 200, output: upRes.outputs }))
          .catch((err) => ({
            statusCode: 409,
            output: { err, level: 'err_1' }
          }));

        if (upRes1.statusCode === 200 && upRes1.output) {
          

          const {
            url: { value: api_url },
            apiID: { value: api_id },
            apiName: { value: api_name },
            rootResourceId: { value: root_resource_id },
            lam_role: { value: { arn: lam_role_arn }},
            executionArn: { value: execution_arn },
            ec2Instance: { value: ec2_instance },
          } = upRes1.output;

          const stack2 = await LocalWorkspace.createStack({
            projectName,
            stackName: `${stackName}-pt-2`,
            program: async () =>  await core_api_pt_2({
                apiID: api_id,
                rootResourceId: root_resource_id,
                rid,
                ec2InstanceName: ec2_instance.tags.Name,
                ec2InstanceId: ec2_instance.id,
                ec2InstancePublicDns: ec2_instance.publicDns,
                apiName: api_name,
                apiUrl: api_url,
                lam_role_arn,
                executionArn: execution_arn,
                secretRid,
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
          

          if (upRes2.statusCode === 200 && upRes2.output) {

            const {
              lambdaResourceId: { value: lambda_resource_id },
              dynamodbResourceId: { value: dynamodb_resource_id },
              s3ResourceId: { value: s3_resource_id },
              ec2CloudfrontDistribution: { value: ec2_cloud_front_distribution }
            } = upRes2.output;

            const api_username = randomUsernameGenerator();
            const api_user_passkey = randomIntegerID(8);

            const date = new Date();

            const data = {
              email,
              api_username,
              api_user_passkey,
              r_id: rid,
              secret_rid: secretRid,
              api_url,
              api_id,
              api_key: apiKey,
              api_name,
              root_resource_id,
              lambda_resource_id,
              dynamodb_resource_id,
              s3_resource_id,
              lam_role_arn,
              execution_arn,
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
              date_created: date,
              date_renewed: date,
            };

            const createLedgerEntryRes = await createLedgerEntry({
              ledger_access_id: API72_LEDGER_ACCESS_ID,
              data,
            }).then((response) => {
              return {
                statusCode: 200,
                output: response,
              };
            }).catch((err) => {
              return {
                statusCode: 500,
                output: { err, level: 'err_3' },
              };
            });

            if (createLedgerEntryRes.statusCode === 200) {

              const stack3 = await LocalWorkspace.createStack({
                projectName,
                stackName: `${stackName}-pt-3`,
                program: async () =>  await core_api_pt_3({
                    apiID: api_id,
                    apiName: api_name,
                    apiUrl: api_url,
                    rootResourceId: root_resource_id,
                    dynamodbResourceId: dynamodb_resource_id,
                    lambdaResourceId: lambda_resource_id,
                    s3ResourceId: s3_resource_id,
                    lam_role_arn,
                    executionArn: execution_arn,
                    rid,
                    secretRid,
                })
              });

              await stack3.workspace.installPlugin("aws", "v4.0.0");
              await stack3.setConfig("aws:region", { value: "us-east-2" });

              const upRes3 = await stack3.up({ onOutput: () => {} })
              .then((upRes) => {
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

                let clientEmail;

                if (email) {
                  clientEmail = {
                    subject: "Your API is ready!",
                    content: `Now that you have created your API (${api_url}), you can view documentation and functionality by going here:<br><br><a href="https://webhub.mintlify.app/">WebHub Documentation</a><br><br>Happy building,<br><br>Email us at <a href="mailto:webhubhq@gmail.com">webhubhq@gmail.com</a> with any questions!`,
                    email
                  }
                }

                // send an email to webhubhq saying that someone deployed a new api
                const webhubhqEmail = {
                  subject: "New WebHUB API Deployed",
                  content: `
                  <br>
                  Email: ${email || '{{email-undefined}}'}
                  Pulumi project name: ${projectName}
                  <br>
                  Cloudfront Distribution: ${ec2_cloud_front_distribution.domainName}
                  <br>
                  ApiGateway URL: ${api_url}
                  <br>
                  EOM
                  `,
                  email: 'webhubhq@gmail.com'
                }

                await Promise.all([
                  clientEmail ? sendEmail(clientEmail) : () => {},
                  sendEmail(webhubhqEmail)
                ]);
                

              } else {
                output = upRes3.output;
              }

            } else {
              statusCode = createLedgerEntryRes.statusCode;
              output = createLedgerEntryRes.output;
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
