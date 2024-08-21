import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import fetch from "node-fetch"
import { RID, extractDomain } from "../../../../../utils/utils";

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const _webhub_host = extractDomain(publicRuntimeConfig.NEXT_PUBLIC_WEBHUB_HOST || publicRuntimeConfig.NEXTAUTH_URL);

const handler = async ({
    apiID, apiUrl, apiName,
    rootResourceId, dynamodbResourceId, lambdaResourceId,
    s3ResourceId,
    lam_role_arn, executionArn, rid, secretRid
}) => {

//     /*
//     **  RESOURCES
//     */

//     /*
//         /create
//     */
//     const folderCreateResource = new aws.apigateway.Resource(`folder-create-resource-${rid}`, {
//         restApi: apiID,
//         parentId: rootResourceId,
//         pathPart: "create",
//     });
 
//     /*
//         /create/service
//     */
//     const folderCreateServiceResource = new aws.apigateway.Resource(`folder-create-service-resource-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateResource.id,
//         pathPart: "service",
//     }, { dependsOn: [
//         folderCreateResource,
//     ]});

//     /*
//         /create/service/lambda
//     */
//     const folderCreateServiceLambdaResource = new aws.apigateway.Resource(`folder-create-service-lambda-resource-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateServiceResource.id,
//         pathPart: "lambda",
//     }, { dependsOn: [
//         folderCreateServiceResource,
//     ]});

//     /*
//         /create/service/lambda/{lambdaName}
//     */
//     const folderCreateServiceLambdaNameResource = new aws.apigateway.Resource(`folder-create-service-lambdaName-resource-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateServiceLambdaResource.id,
//         pathPart: "{lambdaName}",
//     }, { dependsOn: [
//         folderCreateServiceLambdaResource,
//     ]});
    
//     /*
//         /create/service/db
//     */
//     const folderCreateServiceDBResource = new aws.apigateway.Resource(`folder-create-service-db-resource-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateServiceResource.id,
//         pathPart: "db",
//     }, { dependsOn: [
//         folderCreateServiceResource,
//     ]});

//     /*
//         /create/service/db/dynamodb
//     */
//     const folderCreateServiceDBDynamoDBResource = new aws.apigateway.Resource(`folder-create-service-db-dynamodb-resource-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateServiceDBResource.id,
//         pathPart: "dynamodb",
//     }, { dependsOn: [
//         folderCreateServiceDBResource,
//     ]});

//     /*
//         /create/service/db/dynamodb/{dbname}
//     */
//     const folderCreateServiceDBNameResource = new aws.apigateway.Resource(`folder-create-service-dbname-resource-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateServiceDBDynamoDBResource.id,
//         pathPart: "{dbname}",
//     }, { dependsOn: [
//         folderCreateServiceDBDynamoDBResource,
//     ]});

//     /*
//         /create/service/db/s3
//     */
//     const folderCreateServiceDBS3Resource = new aws.apigateway.Resource(`folder-create-service-db-s3-resource-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateServiceDBResource.id,
//         pathPart: "s3",
//     }, { dependsOn: [
//         folderCreateServiceDBDynamoDBResource,
//     ]});

//     /*
//         /create/service/db/s3/{bucket-name}
//     */
//     const folderCreateServiceBucketNameResource = new aws.apigateway.Resource(`folder-create-service-bucket-name-resource-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateServiceDBS3Resource.id,
//         pathPart: "{bucket-name}",
//     }, { dependsOn: [
//         folderCreateServiceDBS3Resource,
//     ]});

//     /*
//         /create/service/cloudfrontS3
//     */
//     const folderCreateServiceCldfrntS3Resource = new aws.apigateway.Resource(`folder-create-service-cldfrnt-S3-resource-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateServiceResource.id,
//         pathPart: "cloudfrontS3",
//     }, { dependsOn: [
//         folderCreateServiceResource,
//     ]});

//     /*
//         /create/service/cloudfrontS3/{name}
//     */
//     const folderCreateServiceCldfrntS3BucketNameResource = new aws.apigateway.Resource(`flder-crte-srvce-cldfrnt-s3-bckt-nme-rsrce-${rid}`, {
//         restApi: apiID,
//         parentId: folderCreateServiceCldfrntS3Resource.id,
//         pathPart: "{name}",
//     }, { dependsOn: [
//         folderCreateServiceDBS3Resource,
//     ]});


//     /*
//     **  METHOD
//     */
    
//     const methodCreateServiceDBName = new aws.apigateway.Method(`create-service-dbname-get-method-${rid}`, {
//         restApi: apiID,
//         resourceId: folderCreateServiceDBNameResource.id,
//         httpMethod: "GET",
//         authorization: "NONE",
//         apiKeyRequired: false,
//     }, { dependsOn: [
//         folderCreateServiceDBNameResource,
//     ]});

//     const methodCreateServiceLambda = new aws.apigateway.Method(`create-service-lambda-post-method-${rid}`, {
//         restApi: apiID,
//         resourceId: folderCreateServiceLambdaNameResource.id,
//         httpMethod: "POST",
//         authorization: "NONE",
//         apiKeyRequired: false,
//     }, { dependsOn: [
//         folderCreateServiceLambdaNameResource
//     ]});

//     const methodCreateServiceBucketName = new aws.apigateway.Method(`create-service-bucket-name-get-method-${rid}`, {
//         restApi: apiID,
//         resourceId: folderCreateServiceBucketNameResource.id,
//         httpMethod: "GET",
//         authorization: "NONE",
//         apiKeyRequired: false,
//     }, { dependsOn: [
//         folderCreateServiceBucketNameResource,
//     ]});

//     const methodCreateServiceCloudfrontS3Name = new aws.apigateway.Method(`create-service-cldfrnt-s3-name-get-method-${rid}`, {
//         restApi: apiID,
//         resourceId: folderCreateServiceCldfrntS3BucketNameResource.id,
//         httpMethod: "GET",
//         authorization: "NONE",
//         apiKeyRequired: false,
//     }, { dependsOn: [
//         folderCreateServiceCldfrntS3BucketNameResource,
//     ]});



//     /*
//     **  LAMBDAS
//     */

//     const createDynamoDBCrudApiLambda = new aws.lambda.Function(
//         `create-dynamodb-crud-api-lambda-${rid}`,
//         {
//             code: new pulumi.asset.AssetArchive({
//                 "index.js": new pulumi.asset.StringAsset(`

//                 const https = require('https');
                
//                 const RID = (l = 8) => {
//                     const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//                     let rid = '';
//                     for (let i = 0; i < l; i += 1) {
//                         const r = Math.random() * c.length;
//                         rid += c.substring(r, r + 1);
//                     }
//                     return rid;
//                 };

//                 const createDynamoDBPostRequest = (dbname) => {
//                     const data = {
//                         apiID: "${apiID}",
//                         apiName: "${apiName}",
//                         dynamodbResourceId: "${dynamodbResourceId}",
//                         dbName: dbname,
//                         rid: "${rid}",
//                         executionArn: "${executionArn}",
//                         lam_role_arn: "${lam_role_arn}",
//                     };

//                     return new Promise((resolve, reject) => {
//                         const options = {
//                             host: '${_webhub_host}',
//                             path: '/api/deploy/dynamoDBAPI',
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             }
//                         };

//                         const req = https.request(options, (res) => {
//                             let responseData = '';
                            
//                             res.on('data', (chunk) => {
//                                 responseData += chunk;
//                             });

//                             res.on('end', () => {
//                                 resolve(responseData); // Resolve with the complete response data
//                             });
//                         });

//                         req.on('error', (e) => {
//                             reject(e.message);
//                         });

//                         req.write(JSON.stringify(data));
//                         req.end();
//                     });
//                 };

//                 const saveDynamoDBToLedger = (resource) => {
//                     const data_ = {
//                         resource_type: "db/dynamodb",
//                         ...resource,
//                     };
                    
//                     const data = {
//                         id: RID(),
//                         name: JSON.stringify(data_)
//                     };

//                     return new Promise((resolve, reject) => {
//                         const options = {
//                             host: '${extractDomain(apiUrl)}',
//                             path: '/v3/ledger/create',
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             }
//                         };

//                         const req = https.request(options, (res) => {
//                             let responseData = '';
                            
//                             res.on('data', (chunk) => {
//                                 responseData += chunk;
//                             });

//                             res.on('end', () => {
//                                 resolve(responseData); // Resolve with the complete response data
//                             });
//                         });

//                         req.on('error', (e) => {
//                             reject(e.message);
//                         });

//                         req.write(JSON.stringify(data));
//                         req.end();
//                     });
//                 };


//                 exports.handler = async (event) => {
//                     const { dbname } = event.pathParameters || {};
//                     const createDynamoDBResult = await createDynamoDBPostRequest(dbname)
//                         .then(responseData => {
//                             // console.log('Response data:', responseData);
//                             try {
//                             const obj = JSON.parse(responseData);
//                             if (obj.type === 'success') {
//                                 const {
//                                 dbName: { value: db_name },
//                                 unique_db_name: { value: unique_dbname },
//                                 } = obj['0']['outputs'];
//                                 return { type: 'success', resource: { db_name, unique_dbname, date_created: new Date() } }
//                             } else {
//                                 return { type: 'error', err: 'pulumi returned an error code' }
//                             }
//                             } catch (err) {
//                                 return { type: 'error', err }
//                             }
//                         })
//                         .catch(err => {
//                             // console.error('Error:', err);
//                             // throw err; // Re-throw the error to be caught by the Lambda handler
//                             return { type: 'error', err }
//                         });
                        
//                     if (createDynamoDBResult.type === 'success') {
//                         const dynamoDBLedgerResult = await saveDynamoDBToLedger(createDynamoDBResult.resource)
//                             .then(responseData => {
//                                 // console.log('Response data:', responseData);
//                                 return { type: 'success', responseData }
//                             })
//                             .catch(err => {
//                                 // console.error('Error:', err);
//                                 // throw err; // Re-throw the error to be caught by the Lambda handler
//                                 return { type: 'error', err }
//                             });
                        
//                         return {
//                             dynamoDBLedgerResult,
//                             complete: true,
//                         }
                    
//                     }
//                     return {
//                         createDynamoDBResult,
//                         complete: false,
//                     }
//                 };
//                 `),
//             }),
//             role: lam_role_arn,
//             handler: "index.handler",
//             runtime: "nodejs20.x",
//             timeout: 120, 
//         }
//     );

//     const createLambdaCrudApiLambda = new aws.lambda.Function(
//         `create-lambda-crud-api-lambda-${rid}`,
//         {
//             code: new pulumi.asset.AssetArchive({
//                 "index.js": new pulumi.asset.StringAsset(`

// const https = require('https');

// const isBase64 = (str) => {
//     try {
//         // Check if decoded string is the same as the original string. 
//         // If so, it's likely not a valid base64 encoded string.
//         return Buffer.from(str, 'base64').toString('base64') === str;
//     } catch (e) {
//         return false;
//     }
// };


// const parseBody = (body) => {
//     if (!body) {
//         return
//     }

//     const type = typeof(body);
//     if (type === 'object') {
//         return body;
//     }
    

//     try {
//         if (isBase64(body)) {
//             const decodedBase64 = Buffer.from(body, 'base64').toString('utf8');
//             return JSON.parse(decodedBase64);
//             }
//         // stringified JSON
//         return JSON.parse(body)
//     } catch (err) {
            
        

//         // url encoded
//         const decodedString = Buffer.from(body, 'base64').toString('utf8');
            
//         const inputString = decodedString
        
//         // Splitting by '&' to get key-value pairs
//         const keyValuePairs = inputString.split('&').map(pair => pair.split('='));
                
//         // Convert 2D array to object and decode each URL encoding value 
//         const resultObject = keyValuePairs.reduce((obj, [key, value]) => {
//             obj[key] = decodeURIComponent(value);
//             return obj;
//         }, {});

//         return resultObject;
//     }
// };
                
                
// const RID = (l = 8) => {
//     const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let rid = '';
//     for (let i = 0; i < l; i += 1) {
//         const r = Math.random() * c.length;
//         rid += c.substring(r, r + 1);
//     }
//     return rid;
// };

// const createLambdaPostRequest = (lambdaName, code) => {
//     const data = {
//         apiID: "${apiID}",
//         apiName: "${apiName}",
//         lambdaResourceId: "${lambdaResourceId}",
//         lambdaName: lambdaName,
//         code:code,
//         rid: "${rid}",
//         executionArn: "${executionArn}",
//         lam_role_arn: "${lam_role_arn}",
//     };

//     return new Promise((resolve, reject) => {
//         const options = {
//             host: '${_webhub_host}',
//             path: '/api/deploy/lambdaAPI',
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         };

//         const req = https.request(options, (res) => {
//             let responseData = '';
            
//             res.on('data', (chunk) => {
//                 responseData += chunk;
//             });

//             res.on('end', () => {
//                 resolve(responseData); // Resolve with the complete response data
//             });
//         });

//         req.on('error', (e) => {
//             reject(e.message);
//         });

//         req.write(JSON.stringify(data));
//         req.end();
//     });
// };

// const savelambdaToLedger = (resource) => {
//     const data_ = {
//         resource_type: "lambda",
//         ...resource,
//     };
    
//     const data = {
//         id: RID(),
//         name: JSON.stringify(data_)
//     };

//     return new Promise((resolve, reject) => {
//         const options = {
//             host: '${extractDomain(apiUrl)}',
//             path: '/v3/ledger/create',
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         };

//         const req = https.request(options, (res) => {
//             let responseData = '';
            
//             res.on('data', (chunk) => {
//                 responseData += chunk;
//             });

//             res.on('end', () => {
//                 resolve(responseData); // Resolve with the complete response data
//             });
//         });

//         req.on('error', (e) => {
//             reject(e.message);
//         });

//         req.write(JSON.stringify(data));
//         req.end();
//     });
// };


// exports.handler = async (event) => {
//     const { lambdaName } = event.pathParameters || {};
    
//     const bodyObj = parseBody(event.body);
    
//     const code=  bodyObj.code

//     const createLambdaResult = await createLambdaPostRequest(lambdaName, code)
//         .then(responseData => {
//             // console.log('Response data:', responseData);
//             try {
//             const obj = JSON.parse(responseData);
//             if (obj.type === 'success') {
//                 const {
//                 lambdaName: { value: lambdaName },
//                 unique_lambda_name: { value: unique_lambda_name },
//                 } = obj['0']['outputs'];
//                 return { type: 'success', resource: { lambdaName, unique_lambda_name, date_created: new Date() } }
//             } else {
//                 return { type: 'error', err: 'pulumi returned an error code' }
//             }
//             } catch (err) {
//                 return { type: 'error', err }
//             }
//         })
//         .catch(err => {
//             // console.error('Error:', err);
//             // throw err; // Re-throw the error to be caught by the Lambda handler
//             return { type: 'error', err }
//         });
        
//     if (createLambdaResult.type === 'success') {
//         const lambdaLedgerResult = await savelambdaToLedger(createLambdaResult.resource)
//             .then(responseData => {
//                 // console.log('Response data:', responseData);
//                 return { type: 'success', responseData }
//             })
//             .catch(err => {
//                 // console.error('Error:', err);
//                 // throw err; // Re-throw the error to be caught by the Lambda handler
//                 return { type: 'error', err }
//             });
        
//         return {
//             lambdaLedgerResult,
//             complete: true,
//         }
    
//     }
//     return {
//         createLambdaResult,
//         complete: false,
//     }
// };
//                 `),
//             }),
//             role: lam_role_arn,
//             handler: "index.handler",
//             runtime: "nodejs18.x",
//             timeout: 120, 
//         }
//     );

//     // lambda test event
//     // {
//     //     "pathParameters": {
//     //         "bucket-name": "ricky6666"
//     //     }
//     // }

//     const createS3CrudApiLambda = new aws.lambda.Function(
//         `create-s3-crud-api-lambda-${rid}`,
//         {
//             code: new pulumi.asset.AssetArchive({
//                 "index.js": new pulumi.asset.StringAsset(`

//                 const https = require('https');
                
//                 const RID = (l = 8) => {
//                     const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//                     let rid = '';
//                     for (let i = 0; i < l; i += 1) {
//                         const r = Math.random() * c.length;
//                         rid += c.substring(r, r + 1);
//                     }
//                     return rid;
//                 };

//                 const response = ({ body, status }) => {
//                     return {
//                         statusCode: status,
//                         body: JSON.stringify({ body }),
//                     };
//                 }

//                 const createS3PostRequest = (bucketName) => {
//                     const data = {
//                         apiID: "${apiID}",
//                         apiName: "${apiName}",
//                         s3ResourceId: "${s3ResourceId}",
//                         bucketName: bucketName,
//                         rid: "${rid}",
//                         executionArn: "${executionArn}",
//                         lam_role_arn: "${lam_role_arn}",
//                     };

//                     return new Promise((resolve, reject) => {
//                         const options = {
//                             host: '${_webhub_host}',
//                             path: '/api/deploy/s3API',
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             }
//                         };

//                         const req = https.request(options, (res) => {
//                             let responseData = '';
                            
//                             res.on('data', (chunk) => {
//                                 responseData += chunk;
//                             });

//                             res.on('end', () => {
//                                 resolve(responseData); // Resolve with the complete response data
//                             });
//                         });

//                         req.on('error', (e) => {
//                             reject(e.message);
//                         });

//                         req.write(JSON.stringify(data));
//                         req.end();
//                     });
//                 };

//                 const saveS3ToLedger = (resource) => {
//                     const data_ = {
//                         resource_type: "db/s3",
//                         ...resource,
//                     };
                    
//                     const data = {
//                         id: RID(),
//                         name: JSON.stringify(data_)
//                     };

//                     return new Promise((resolve, reject) => {
//                         const options = {
//                             host: '${extractDomain(apiUrl)}',
//                             path: '/v3/ledger/create',
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             }
//                         };

//                         const req = https.request(options, (res) => {
//                             let responseData = '';
                            
//                             res.on('data', (chunk) => {
//                                 responseData += chunk;
//                             });

//                             res.on('end', () => {
//                                 resolve(responseData); // Resolve with the complete response data
//                             });
//                         });

//                         req.on('error', (e) => {
//                             reject(e.message);
//                         });

//                         req.write(JSON.stringify(data));
//                         req.end();
//                     });
//                 };


//                 exports.handler = async (event) => {
//                     const { 'bucket-name': bucketName } = event.pathParameters || {};
//                     const createS3Result = await createS3PostRequest(bucketName)
//                         .then(responseData => {
//                             // console.log('Response data:', responseData);
//                             try {
//                             const obj = JSON.parse(responseData);
//                             if (obj.type === 'success') {
//                                 const {
//                                     unique_bucket_name: { value: unique_bucketName },
//                                 } = obj['0']['outputs'];
//                                 return { type: 'success', resource: { bucketName, uniqueBucketName: unique_bucketName, date_created: new Date() } }
//                             } else {
//                                 return { type: 'error', err: 'pulumi returned an error code' }
//                             }
//                             } catch (err) {
//                                 return { type: 'error', err }
//                             }
//                         })
//                         .catch(err => {
//                             // console.error('Error:', err);
//                             // throw err; // Re-throw the error to be caught by the Lambda handler
//                             return { type: 'error', err }
//                         });
                        
//                     if (createS3Result.type === 'success') {
//                         const s3LedgerResult = await saveS3ToLedger(createS3Result.resource)
//                             .then(responseData => {
//                                 // console.log('Response data:', responseData);
//                                 return { type: 'success', responseData }
//                             })
//                             .catch(err => {
//                                 // console.error('Error:', err);
//                                 // throw err; // Re-throw the error to be caught by the Lambda handler
//                                 return { type: 'error', err }
//                             });
                        
//                         return response({
//                             body: {
//                                 s3LedgerResult,
//                                 complete: true,
//                             },
//                             status: 200,
//                         });
                    
//                     }
                    
//                     return response({
//                         body: {
//                             createS3Result,
//                             complete: false,
//                         },
//                         status: 409,
//                     });
//                 };
//                 `),
//             }),
//             role: lam_role_arn,
//             handler: "index.handler",
//             runtime: "nodejs20.x",
//             timeout: 120, 
//         }
//     );

//     const createCloudfrontS3Distribution = new aws.lambda.Function(
//         `create-cldfrnt-s3-distribution-lambda-${rid}`,
//         {
//             code: new pulumi.asset.AssetArchive({
//                 "index.js": new pulumi.asset.StringAsset(`

//                 const https = require('https');
                
//                 const RID = (l = 8) => {
//                     const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//                     let rid = '';
//                     for (let i = 0; i < l; i += 1) {
//                         const r = Math.random() * c.length;
//                         rid += c.substring(r, r + 1);
//                     }
//                     return rid;
//                 };

//                 const response = ({ body, status }) => {
//                     return {
//                         statusCode: status,
//                         body: JSON.stringify({ body }),
//                     };
//                 }

//                 const createCldfrntS3PostRequest = (name) => {
//                     const data = {
//                         apiID: "${apiID}",
//                         name,
//                         rid: "${rid}",
//                         executionArn: "${executionArn}",
//                     };

//                     return new Promise((resolve, reject) => {
//                         const options = {
//                             host: '${_webhub_host}',
//                             path: '/api/deploy/cloudfront_s3API',
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             }
//                         };

//                         const req = https.request(options, (res) => {
//                             let responseData = '';
                            
//                             res.on('data', (chunk) => {
//                                 responseData += chunk;
//                             });

//                             res.on('end', () => {
//                                 resolve(responseData); // Resolve with the complete response data
//                             });
//                         });

//                         req.on('error', (e) => {
//                             reject(e.message);
//                         });

//                         req.write(JSON.stringify(data));
//                         req.end();
//                     });
//                 };

//                 const saveCldfrntS3ToLedger = (resource) => {
//                     const data_ = {
//                         resource_type: "cloudfrontS3",
//                         ...resource,
//                     };
                    
//                     const data = {
//                         id: RID(),
//                         name: JSON.stringify(data_)
//                     };

//                     return new Promise((resolve, reject) => {
//                         const options = {
//                             host: '${extractDomain(apiUrl)}',
//                             path: '/v3/ledger/create',
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             }
//                         };

//                         const req = https.request(options, (res) => {
//                             let responseData = '';
                            
//                             res.on('data', (chunk) => {
//                                 responseData += chunk;
//                             });

//                             res.on('end', () => {
//                                 resolve(responseData); // Resolve with the complete response data
//                             });
//                         });

//                         req.on('error', (e) => {
//                             reject(e.message);
//                         });

//                         req.write(JSON.stringify(data));
//                         req.end();
//                     });
//                 };


//                 exports.handler = async (event) => {
//                     const { name } = event.pathParameters || {};
//                     const createCldfrntS3Result = await createCldfrntS3PostRequest(name)
//                         .then(responseData => {
//                             // console.log('Response data:', responseData);
//                             try {
//                             const obj = JSON.parse(responseData);
//                             if (obj.type === 'success') {
//                                 const {
//                                     iamUser: { value: iam_user },
//                                     iamUserAccessKeys: { value: iam_user_access_keys },
//                                     cloudfrontDistribution: { value: cloudfront_distribution },
//                                     s3Bucket: { value: s3_bucket },
//                                     unique_cloudfrontS3_name: { value: unique_cloudfrontS3Name },

//                                 } = obj['0']['outputs'];
//                                 return { type: 'success', resource: { cloudfrontS3Name: name, uniqueCloudfrontS3Name: unique_cloudfrontS3Name, iam_user, iam_user_access_keys, cloudfront_distribution, s3_bucket, date_created: new Date() } }
//                             } else {
//                                 return { type: 'error', err: 'pulumi returned an error code' }
//                             }
//                             } catch (err) {
//                                 return { type: 'error', err }
//                             }
//                         })
//                         .catch(err => {
//                             // console.error('Error:', err);
//                             // throw err; // Re-throw the error to be caught by the Lambda handler
//                             return { type: 'error', err }
//                         });
                        
//                     if (createCldfrntS3Result.type === 'success') {
//                         const cldfrntS3LedgerResult = await saveCldfrntS3ToLedger(createCldfrntS3Result.resource)
//                             .then(responseData => {
//                                 // console.log('Response data:', responseData);
//                                 return { type: 'success', responseData }
//                             })
//                             .catch(err => {
//                                 // console.error('Error:', err);
//                                 // throw err; // Re-throw the error to be caught by the Lambda handler
//                                 return { type: 'error', err }
//                             });
                        
//                         return response({
//                             body: {
//                                 cldfrntS3LedgerResult,
//                                 complete: true,
//                             },
//                             status: 200,
//                         });
                    
//                     }
                    
//                     return response({
//                         body: {
//                             createCldfrntS3Result,
//                             complete: false,
//                         },
//                         status: 409,
//                     });
//                 };
//                 `),
//             }),
//             role: lam_role_arn,
//             handler: "index.handler",
//             runtime: "nodejs20.x",
//             timeout: 120, 
//         }
//     );


//     /*
//     **  INTEGRATIONS
//     */

//     const integrationCreateServiceDBName = new aws.apigateway.Integration(`create-service-dbname-integration-${rid}`, {
//         restApi: apiID,
//         resourceId: folderCreateServiceDBNameResource.id,
//         httpMethod: methodCreateServiceDBName.httpMethod,
//         type: "AWS_PROXY",
//         integrationHttpMethod: "POST",
//         uri: createDynamoDBCrudApiLambda.invokeArn,
//         timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
//     }, { dependsOn: [
//         folderCreateServiceDBNameResource,
//         methodCreateServiceDBName,
//         createDynamoDBCrudApiLambda,
//     ]});

//     const integrationCreateServiceLambda = new aws.apigateway.Integration(`create-service-lambda-integration-${rid}`, {
//         restApi: apiID,
//         resourceId: folderCreateServiceLambdaNameResource.id,
//         httpMethod: methodCreateServiceLambda.httpMethod,
//         type: "AWS_PROXY",
//         integrationHttpMethod: "POST",
//         uri: createLambdaCrudApiLambda.invokeArn,
//         timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
//     }, { dependsOn: [
//         folderCreateServiceLambdaNameResource,
//         methodCreateServiceLambda,
//         createLambdaCrudApiLambda,
//     ]});

//     const integrationCreateServiceBucketName = new aws.apigateway.Integration(`create-service-bucket-name-integration-${rid}`, {
//         restApi: apiID,
//         resourceId: folderCreateServiceBucketNameResource.id,
//         httpMethod: methodCreateServiceBucketName.httpMethod,
//         type: "AWS_PROXY",
//         integrationHttpMethod: "POST",
//         uri: createS3CrudApiLambda.invokeArn,
//         timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
//     }, { dependsOn: [
//         folderCreateServiceBucketNameResource,
//         methodCreateServiceBucketName,
//         createS3CrudApiLambda,
//     ]});

//     const integrationCreateServiceCloudfrontS3Name = new aws.apigateway.Integration(`create-service-cloudfront-s3-name-integration-${rid}`, {
//         restApi: apiID,
//         resourceId: folderCreateServiceCldfrntS3BucketNameResource.id,
//         httpMethod: methodCreateServiceCloudfrontS3Name.httpMethod,
//         type: "AWS_PROXY",
//         integrationHttpMethod: "POST",
//         uri: createCloudfrontS3Distribution.invokeArn,
//         timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
//     }, { dependsOn: [
//         folderCreateServiceCldfrntS3BucketNameResource,
//         methodCreateServiceCloudfrontS3Name,
//         createCloudfrontS3Distribution,
//     ]});


//     /*
//     **  LAMBDA PERMISSIONS
//     */

//     const createServiceDBNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-dbname-api-gateway-invoke-permission-${rid}`, {
//         action: 'lambda:InvokeFunction',
//         function: createDynamoDBCrudApiLambda.name,
//         principal: 'apigateway.amazonaws.com',
//         sourceArn: pulumi.interpolate`${executionArn}/*/*`
//     }, { dependsOn: [
//         createDynamoDBCrudApiLambda,
//     ]});

//     const createServiceLambdaApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-lambda-api-gateway-invoke-permission-${rid}`, {
//         action: 'lambda:InvokeFunction',
//         function: createLambdaCrudApiLambda.name,
//         principal: 'apigateway.amazonaws.com',
//         sourceArn: pulumi.interpolate`${executionArn}/*/*`
//     }, { dependsOn: [
//         createLambdaCrudApiLambda,
//     ]});

//     const createServiceBucketNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-bucket-name-api-gateway-invoke-permission-${rid}`, {
//         action: 'lambda:InvokeFunction',
//         function: createS3CrudApiLambda.name,
//         principal: 'apigateway.amazonaws.com',
//         sourceArn: pulumi.interpolate`${executionArn}/*/*`
//     }, { dependsOn: [
//         createS3CrudApiLambda,
//     ]});

//     const createServiceCloudfrontS3GatewayInvokePermission = new aws.lambda.Permission(`create-service-cldfrnt-s3-gateway-invoke-permission-${rid}`, {
//         action: 'lambda:InvokeFunction',
//         function: createCloudfrontS3Distribution.name,
//         principal: 'apigateway.amazonaws.com',
//         sourceArn: pulumi.interpolate`${executionArn}/*/*`
//     }, { dependsOn: [
//         createCloudfrontS3Distribution,
//     ]});


//     /*
//     **  DEPLOYMENT
//     */

//     const deployment = new aws.apigateway.Deployment(`crud-dynamic-endpoints-deployment-${rid}`, {
//         restApi: apiID,
//         stageName: "v3", // Uncomment this line if you want to specify a stage name.
//     }, { dependsOn: [
//         // create/service/db/dynamodb/{dbname}
//         methodCreateServiceDBName, integrationCreateServiceDBName,
//         // create/service/db/s3/{bucket-name}
//         methodCreateServiceBucketName, integrationCreateServiceBucketName,
//         // create/service/cloudfrontS3
//         methodCreateServiceCloudfrontS3Name, integrationCreateServiceCloudfrontS3Name,
//         // create/service/lambda/{name}
//         methodCreateServiceLambda, integrationCreateServiceLambda,
//     ] });
    
    return { };
};

export default handler;
