import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import fetch from "node-fetch"
import { RID } from "../../../../utils/utils";

const handler = async ({ apiID, apiUrl, apiName, rootResourceId, dbResourceId, lam_role_arn, executionArn, rid }) => {

    const folderCreateResource = new aws.apigateway.Resource(`folder-create-resource-${rid}`, {
        restApi: apiID,
        parentId: rootResourceId,
        pathPart: "create",
    });
    
    const folderDynamodbResource = new aws.apigateway.Resource(`folder-dynamodb-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateResource.id,
        pathPart: "dynamodb",
    });

    const folderDBNameResource = new aws.apigateway.Resource(`folder-dbname-resource-${rid}`, {
        restApi: apiID,
        parentId: folderDynamodbResource.id,
        pathPart: "{dbname}",
    });
    
    const method = new aws.apigateway.Method(`crud-dynamic-endpoints-get-method-${rid}`, {
        restApi: apiID,
        resourceId: folderDBNameResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    // lambda test event
    // {
    //     "pathParameters": {
    //         "dbname": "ricky6666"
    //     }
    // }

    const createDynamoDBCrudApiLambda = new aws.lambda.Function(
        `create-dynamodb-crud-api-lambda-${rid}`,
        {
            code: new pulumi.asset.AssetArchive({
                "index.js": new pulumi.asset.StringAsset(`
                  const https = require('https');

                  const doPostRequest = (dbname) => {
                    const data = {
                        apiID: "${apiID}",
                        apiName: "${apiName}",
                        dbResourceId: "${dbResourceId}",
                        dbName: dbname,
                        rid: "${rid}",
                        executionArn: "${executionArn}",
                      };
                  
                      return new Promise((resolve, reject) => {
                          const options = {
                              host: 'crudhub.onrender.com',
                              path: '/api/deployAddCrudAPI',
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json'
                              }
                          };
                  
                          const req = https.request(options, (res) => {
                              let responseData = '';
                              
                              res.on('data', (chunk) => {
                                  responseData += chunk;
                              });
                  
                              res.on('end', () => {
                                  resolve(responseData); // Resolve with the complete response data
                              });
                          });
                  
                          req.on('error', (e) => {
                              reject(e.message);
                          });
                  
                          req.write(JSON.stringify(data));
                          req.end();
                      });
                  };
                  
                  exports.handler = async (event) => {
                      const { dbname } = event.pathParameters || {};
                      const finalResult = await doPostRequest(dbname)
                          .then(responseData => {
                              // console.log('Response data:', responseData);
                              try {
                                const obj = JSON.parse(responseData);
                                if (obj.type === 'success') {
                                  return { type: 'success', ...obj['0']['outputs'] }
                                } else {
                                  return { type: 'error', err: 'pulumi returned an error code' }
                                }
                              } catch (err) {
                                return { type: 'error', err }
                              }
                          })
                          .catch(err => {
                              // console.error('Error:', err);
                              // throw err; // Re-throw the error to be caught by the Lambda handler
                              return { type: 'error', err }
                          });
                  
                      return {
                          finalResult,
                      };
                  };
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs14.x",
            timeout: 60, 
        }
    );

    // const createDynamoDBCrudApiLambda = new aws.lambda.Function(
    //     `create-dynamodb-crud-api-lambda-${rid}`,
    //     {
    //         code: new pulumi.asset.AssetArchive({
    //             "index.js": new pulumi.asset.StringAsset(`
    //                 const axios = require('axios');

    //                 exports.handler = async (event) => {
    //                     const { dbname } = event.pathParameters || {}; // Extract the value of the "dbname" variable from the event
                    
    //                     const body = {
    //                         apiID: "${apiID}",
    //                         apiName: "${apiName}",
    //                         dbResourceId: "${dbResourceId}",
    //                         dbName: dbname,
    //                         rid: "${rid}",
    //                         executionArn: "${executionArn}",
    //                     };
                    
    //                     try {
    //                         const response1 = await axios({
    //                             url: 'https://crudhub.onrender.com/api/deployAddCrudAPI',
    //                             method: 'POST',
    //                             headers: {
    //                                 'Access-Control-Allow-Origin': '*',
    //                                 'Content-Type': 'application/json',
    //                             },
    //                             data: JSON.stringify(body),
    //                         });
                    
    //                         console.log('Response 1:', response1.data);

    //                         // need to make another request to the ledger to save the fact that we successfully created a new dynamodb resource for this API
    //                         try {

    //                             const response2 = await axios({
    //                                 url: 'https://${apiUrl}/ledger/create',
    //                                 method: 'POST',
    //                                 headers: {
    //                                     'Access-Control-Allow-Origin': '*',
    //                                     'Content-Type': 'application/json',
    //                                 },
    //                                 data: JSON.stringify({
    //                                     id: '${RID()}',
    //                                     name: 'dynamodb-' + dbname,
    //                                 }),
    //                             });

    //                             return {
    //                                 statusCode: response.status,
    //                                 body: JSON.stringify(response.data),
    //                             };

    //                         } catch (error) {
    //                             console.error('Error stage 2:', error);
                    
    //                             return {
    //                                 statusCode: error.response ? error.response.status : 500,
    //                                 body: JSON.stringify(error.response ? error.response.data : 'Internal Server Error'),
    //                             };
    //                         }
                    
    //                     } catch (error) {
    //                         console.error('Error stage 1:', error);
                    
    //                         return {
    //                             statusCode: error.response ? error.response.status : 500,
    //                             body: JSON.stringify(error.response ? error.response.data : 'Internal Server Error'),
    //                         };
    //                     }
    //                 };
    //             `),
    //             'package.json': new pulumi.asset.StringAsset(`
    //             {
    //                 "name": "create-dynamodb-resource-lambda-axios",
    //                 "version": "1.0.0",
    //                 "description": "lambda function that creates a dynamodb resource crud api and then adds the data to the ledger using axios post request.",
    //                 "main": "index.js",
    //                 "dependencies": {
    //                     "axios": "^0.21.1"
    //                 }
    //             }
    //             `),
    //         }),
    //         role: lam_role_arn,
    //         handler: "index.handler",
    //         runtime: "nodejs14.x",
    //         timeout: 10, 
    //     }
    // );
    

    // // Install node-fetch as a dependency
    // createDynamoDBCrudApiLambda.provider.on("beforeRun", async () => {
    //     await pulumi.runtime.installPackage("node-fetch", { cwd: createDynamoDBCrudApiLambda.assetPath });
    // });

    const integration = new aws.apigateway.Integration(`crud-dynamic-endpoints-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderDBNameResource.id,
        httpMethod: method.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createDynamoDBCrudApiLambda.invokeArn,
    });

    const createDynamoDBCrudApiGatewayInvokePermission = new aws.lambda.Permission(`create-dynamodb-crud-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createDynamoDBCrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const deployment = new aws.apigateway.Deployment(`crud-dynamic-endpoints-deployment-${rid}`, {
        restApi: apiID,
        stageName: "stage", // Uncomment this line if you want to specify a stage name.
    }, { dependsOn: [method, integration] });
    
    return { apiID, apiName, rootResourceId, dbResourceId, executionArn, rid };
};

export default handler;
