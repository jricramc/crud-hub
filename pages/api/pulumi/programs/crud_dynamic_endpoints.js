import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import fetch from "node-fetch"
import { RID } from "../../../../utils/utils";

const handler = async ({ apiID, apiUrl, apiName, rootResourceId, dbResourceId, lam_role_arn, executionArn, rid }) => {

    /*
    **  RESOURCES
    */

    /*
        /create
    */
    const folderCreateResource = new aws.apigateway.Resource(`folder-create-resource-${rid}`, {
        restApi: apiID,
        parentId: rootResourceId,
        pathPart: "create",
    });

    /*
        /create/service
    */
    const folderCreateServiceResource = new aws.apigateway.Resource(`folder-create-service-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateResource.id,
        pathPart: "service",
    });
    
    /*
        /create/service/db
    */
    const folderCreateServiceDBResource = new aws.apigateway.Resource(`folder-create-service-db-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "db",
    });

    /*
        /create/service/db/dynamodb
    */
    const folderCreateServiceDBDynamoDBResource = new aws.apigateway.Resource(`folder-create-service-db-dynamodb-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBResource.id,
        pathPart: "dynamodb",
    });

    /*
        /create/service/db/dynamodb/{dbname}
    */
    const folderCreateServiceDBNameResource = new aws.apigateway.Resource(`folder-create-service-dbname-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBDynamoDBResource.id,
        pathPart: "{dbname}",
    });

    /*
        /create/service/db/s3
    */
    const folderCreateServiceDBS3Resource = new aws.apigateway.Resource(`folder-create-service-db-s3-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBResource.id,
        pathPart: "s3",
    });

    /*
        /create/service/db/dynamodb/{bucket-name}
    */
    const folderCreateServiceBucketNameResource = new aws.apigateway.Resource(`folder-create-service-bucket-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBS3Resource.id,
        pathPart: "{bucket-name}",
    });

    /*
        /create/service/payment
    */
    const folderCreateServicePaymentResource = new aws.apigateway.Resource(`folder-create-service-payment-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "payment",
    });

    /*
        /create/service/payment/stripe
    */
    const folderCreateServicePaymentStripeResource = new aws.apigateway.Resource(`folder-create-service-payment-stripe-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServicePaymentResource.id,
        pathPart: "stripe",
    });

    /*
        /create/service/auth
    */
    const folderCreateServiceAuthResource = new aws.apigateway.Resource(`folder-create-service-auth-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "auth",
    });

    /*
        /create/service/auth/google
    */
        const folderCreateServiceAuthGoogleResource = new aws.apigateway.Resource(`folder-create-service-auth-google-resource-${rid}`, {
            restApi: apiID,
            parentId: folderCreateServiceAuthResource.id,
            pathPart: "google",
        });

    /*
        /create/service/email
    */
    const folderCreateServiceEmailResource = new aws.apigateway.Resource(`folder-create-service-email-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "email",
    });

    /*
        /create/service/email/sendgrid
    */
    const folderCreateServiceEmailSendgridResource = new aws.apigateway.Resource(`folder-create-service-email-sendgrid-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceEmailResource.id,
        pathPart: "sendgrid",
    });

    /*
    **  METHOD
    */
    
    const methodCreateServiceDBName = new aws.apigateway.Method(`create-service-dbname-get-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceDBNameResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    const methodCreateServiceBucketName = new aws.apigateway.Method(`create-service-bucket-name-get-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceBucketNameResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    // const methodCreateServicePaymentStripe = new aws.apigateway.Method(`create-service-payment-stripe-post-method-${rid}`, {
    //     restApi: apiID,
    //     resourceId: folderCreateServicePaymentStripeResource.id,
    //     httpMethod: "POST",
    //     authorization: "NONE",
    //     apiKeyRequired: false,
    // });



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
                
                const RID = (l = 8) => {
                    const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    let rid = '';
                    for (let i = 0; i < l; i += 1) {
                        const r = Math.random() * c.length;
                        rid += c.substring(r, r + 1);
                    }
                    return rid;
                };

                const createDynamoDBPostRequest = (dbname) => {
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
                            host: 'webhubmvp.onrender.com',
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

                const saveDynamoDBToLedger = (resource) => {
                    const data_ = {
                        resource_type: "dynamodb",
                        ...resource,
                    };
                    
                    const data = {
                        id: RID(),
                        name: JSON.stringify(data_)
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${apiUrl.slice(8,-7)}',
                            path: '/stage/ledger/create',
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
                    const createDynamoDBResult = await createDynamoDBPostRequest(dbname)
                        .then(responseData => {
                            // console.log('Response data:', responseData);
                            try {
                            const obj = JSON.parse(responseData);
                            if (obj.type === 'success') {
                                const {
                                dbName: { value: db_name },
                                unique_db_name: { value: unique_dbname },
                                } = obj['0']['outputs'];
                                return { type: 'success', resource: { db_name, unique_dbname, date_created: new Date() } }
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
                        
                    if (createDynamoDBResult.type === 'success') {
                        const dynamoDBLedgerResult = await saveDynamoDBToLedger(createDynamoDBResult.resource)
                            .then(responseData => {
                                // console.log('Response data:', responseData);
                                return { type: 'success', responseData }
                            })
                            .catch(err => {
                                // console.error('Error:', err);
                                // throw err; // Re-throw the error to be caught by the Lambda handler
                                return { type: 'error', err }
                            });
                        
                        return {
                            dynamoDBLedgerResult,
                            complete: true,
                        }
                    
                    }
                    return {
                        createDynamoDBResult,
                        complete: false,
                    }
                };
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs14.x",
            timeout: 120, 
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

    const integrationCreateServiceDBName = new aws.apigateway.Integration(`create-service-dbname-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceDBNameResource.id,
        httpMethod: methodCreateServiceDBName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createDynamoDBCrudApiLambda.invokeArn,
    });

    const integrationCreateServiceBucketName = new aws.apigateway.Integration(`create-service-bucket-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceDBS3Resource.id,
        httpMethod: methodCreateServiceBucketName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createDynamoDBCrudApiLambda.invokeArn,
    });

    const createServiceDBNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-dbname-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createDynamoDBCrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const createServiceBucketNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-bucket-name-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createDynamoDBCrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const deployment = new aws.apigateway.Deployment(`crud-dynamic-endpoints-deployment-${rid}`, {
        restApi: apiID,
        stageName: "stage", // Uncomment this line if you want to specify a stage name.
    }, { dependsOn: [
        methodCreateServiceDBName, integrationCreateServiceDBName,
        methodCreateServiceBucketName, integrationCreateServiceBucketName,
    ] });
    
    return { apiID, apiName, rootResourceId, dbResourceId, executionArn, rid };
};

export default handler;
