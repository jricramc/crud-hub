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
const _webhub_host = extractDomain(publicRuntimeConfig.WEBHUB_HOST || publicRuntimeConfig.NEXTAUTH_URL);

const handler = async ({
    apiID, apiUrl, apiName,
    rootResourceId, dbResourceId, mongodbResourceId, lambdaResourceId,
    s3ResourceId, stripeResourceId, googleResourceId,
    sendgridResourceId, websocketResourceId,
    lam_role_arn, executionArn, rid, stripeLayerArn
}) => {

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
    }, { dependsOn: [
        folderCreateResource,
    ]});

    /*
        /create/service/lambda
    */
    const folderCreateServiceLambdaResource = new aws.apigateway.Resource(`folder-create-service-lambda-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "lambda",
    }, { dependsOn: [
        folderCreateServiceResource,
    ]});

    /*
        /create/service/lambda/{lambdaName}
    */
    const folderCreateServiceLambdaNameResource = new aws.apigateway.Resource(`folder-create-service-lambdaName-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceLambdaResource.id,
        pathPart: "{lambdaName}",
    }, { dependsOn: [
        folderCreateServiceLambdaResource,
    ]});
    
    /*
        /create/service/db
    */
    const folderCreateServiceDBResource = new aws.apigateway.Resource(`folder-create-service-db-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "db",
    }, { dependsOn: [
        folderCreateServiceResource,
    ]});

    /*
        /create/service/db/mongodb
    */
    const folderCreateServiceDBMongoDBResource = new aws.apigateway.Resource(`folder-create-service-db-mongodb-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBResource.id,
        pathPart: "mongodb",
    }, { dependsOn: [
        folderCreateServiceDBResource,
    ]});

    /*
        /create/service/db/mongodb
    */
    const folderCreateServiceMongoDBNameResource = new aws.apigateway.Resource(`folder-create-service-mongodb-dbname-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBMongoDBResource.id,
        pathPart: "{dbname}",
    }, { dependsOn: [
        folderCreateServiceDBMongoDBResource,
    ]});

    /*
        /create/service/db/dynamodb
    */
    const folderCreateServiceDBDynamoDBResource = new aws.apigateway.Resource(`folder-create-service-db-dynamodb-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBResource.id,
        pathPart: "dynamodb",
    }, { dependsOn: [
        folderCreateServiceDBResource,
    ]});

    /*
        /create/service/db/dynamodb/{dbname}
    */
    const folderCreateServiceDBNameResource = new aws.apigateway.Resource(`folder-create-service-dbname-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBDynamoDBResource.id,
        pathPart: "{dbname}",
    }, { dependsOn: [
        folderCreateServiceDBDynamoDBResource,
    ]});

    /*
        /create/service/db/s3
    */
    const folderCreateServiceDBS3Resource = new aws.apigateway.Resource(`folder-create-service-db-s3-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBResource.id,
        pathPart: "s3",
    }, { dependsOn: [
        folderCreateServiceDBDynamoDBResource,
    ]});

    /*
        /create/service/db/dynamodb/{bucket-name}
    */
    const folderCreateServiceBucketNameResource = new aws.apigateway.Resource(`folder-create-service-bucket-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBS3Resource.id,
        pathPart: "{bucket-name}",
    }, { dependsOn: [
        folderCreateServiceDBS3Resource,
    ]});

    /*
        /create/service/payment
    */
    const folderCreateServicePaymentResource = new aws.apigateway.Resource(`folder-create-service-payment-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "payment",
    }, { dependsOn: [
        folderCreateServiceResource,
    ]});

    /*
        /create/service/payment/stripe
    */
    const folderCreateServicePaymentStripeResource = new aws.apigateway.Resource(`folder-create-service-payment-stripe-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServicePaymentResource.id,
        pathPart: "stripe",
    }, { dependsOn: [
        folderCreateServicePaymentResource,
    ]});

    /*
        /create/service/payment/stripe/{name}
    */
    const folderCreateServicePaymentStripeNameResource = new aws.apigateway.Resource(`folder-create-service-payment-stripe-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServicePaymentStripeResource.id,
        pathPart: "{name}",
    }, { dependsOn: [
        folderCreateServicePaymentResource,
    ]});

    /*
        /create/service/auth
    */
    const folderCreateServiceAuthResource = new aws.apigateway.Resource(`folder-create-service-auth-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "auth",
    }, { dependsOn: [
        folderCreateServiceResource,
    ]});

    /*
        /create/service/auth/google
    */
    const folderCreateServiceAuthGoogleResource = new aws.apigateway.Resource(`folder-create-service-auth-google-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceAuthResource.id,
        pathPart: "google",
    }, { dependsOn: [
        folderCreateServiceAuthResource,
    ]});

    /*
        /create/service/auth/google/{oauth-name}
    */
    const folderCreateServiceOAuthNameResource = new aws.apigateway.Resource(`folder-create-service-oauth-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceAuthGoogleResource.id,
        pathPart: "{oauth-name}",
    }, { dependsOn: [
        folderCreateServiceAuthGoogleResource,
    ]});

    /*
        /create/service/email
    */
    const folderCreateServiceEmailResource = new aws.apigateway.Resource(`folder-create-service-email-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "email",
    }, { dependsOn: [
        folderCreateServiceResource,
    ]});

    /*
        /create/service/email/sendgrid
    */
    const folderCreateServiceEmailSendGridResource = new aws.apigateway.Resource(`folder-create-service-email-sendgrid-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceEmailResource.id,
        pathPart: "sendgrid",
    }, { dependsOn: [
        folderCreateServiceEmailResource,
    ]});

    /*
        /create/service/email/sendgrid/{name}
    */
    const folderCreateServiceEmailSendGridNameResource = new aws.apigateway.Resource(`folder-create-service-email-sendgrid-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceEmailSendGridResource.id,
        pathPart: "{name}",
    }, { dependsOn: [
        folderCreateServiceEmailSendGridResource,
    ]});

    /*
        /create/service/websocket
    */
    const folderCreateServiceWebsocketResource = new aws.apigateway.Resource(`folder-create-service-websocket-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "websocket",
    }, { dependsOn: [
        folderCreateServiceResource,
    ]});

    /*
        /create/service/websocket/{name}
    */
    const folderCreateServiceWebsocketNameResource = new aws.apigateway.Resource(`folder-create-service-websocket-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceWebsocketResource.id,
        pathPart: "{name}",
    }, { dependsOn: [
        folderCreateServiceWebsocketResource,
    ]});

    /*
    **  METHOD
    */
    
    const methodCreateServiceDBName = new aws.apigateway.Method(`create-service-dbname-get-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceDBNameResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceDBNameResource,
    ]});

    const methodCreateServiceMongoDBName = new aws.apigateway.Method(`create-service-mongodb-dbname-get-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceMongoDBNameResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceMongoDBNameResource,
    ]});

    const methodCreateServiceLambda = new aws.apigateway.Method(`create-service-lambda-post-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceLambdaNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceLambdaNameResource
    ]});

    const methodCreateServiceBucketName = new aws.apigateway.Method(`create-service-bucket-name-get-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceBucketNameResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceBucketNameResource,
    ]});

    const methodCreateServiceOAuthName = new aws.apigateway.Method(`create-service-oauth-name-post-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceOAuthNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceOAuthNameResource,
    ]});

    const methodCreateServicePaymentStripeName = new aws.apigateway.Method(`create-service-payment-stripe-name-post-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServicePaymentStripeNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServicePaymentStripeNameResource,
    ]});

    const methodCreateServiceEmailSendGridName = new aws.apigateway.Method(`create-service-email-sendgrid-name-post-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceEmailSendGridNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceEmailSendGridNameResource,
    ]});

    const methodCreateServiceWebsocketName = new aws.apigateway.Method(`create-service-websocket-name-get-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceWebsocketNameResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceWebsocketNameResource,
    ]});



    /*
    **  LAMBDAS
    */

    // lambda test event
    // {
    //     "pathParameters": {
    //         "dbname": "ricky6666"
    //     }
    // }

    const createMongoDBApiLambda = new aws.lambda.Function(
        `create-mongodb-crud-api-lambda-${rid}`,
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

                const createMongoDBPostRequest = (dbname) => {
                    const data = {
                        apiID: "${apiID}",
                        apiName: "${apiName}",
                        mongodbResourceId: "${mongodbResourceId}",
                        dbName: dbname,
                        rid: "${rid}",
                        executionArn: "${executionArn}",
                        lam_role_arn: "${lam_role_arn}",
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${_webhub_host}',
                            path: '/api/deploy/mongoDBAPI',
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

                const saveMongoDBToLedger = (resource) => {
                    const data_ = {
                        resource_type: "db/dynamodb",
                        ...resource,
                    };
                    
                    const data = {
                        id: RID(),
                        name: JSON.stringify(data_)
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${extractDomain(apiUrl)}',
                            path: '/v3/ledger/create',
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
                    const createMongoDBResult = await createMongoDBPostRequest(dbname)
                        .then(responseData => {
                            // console.log('Response data:', responseData);
                            try {
                            const obj = JSON.parse(responseData);
                            if (obj.type === 'success') {
                                const {
                                    apiKey: { value: api_key },
                                    dbName: { value: db_name },
                                    unique_db_name: { value: unique_dbname },
                                } = obj['0']['outputs'];
                                return { type: 'success', resource: { api_key, db_name, unique_dbname, date_created: new Date() } }
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
                        
                    if (createMongoDBResult.type === 'success') {
                        const mongoDBLedgerResult = await saveMongoDBToLedger(createMongoDBResult.resource)
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
                            mongoDBLedgerResult,
                            complete: true,
                        }
                    
                    }
                    return {
                        createMongoDBResult,
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
                        lam_role_arn: "${lam_role_arn}",
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${_webhub_host}',
                            path: '/api/deploy/dynamoDBAPI',
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
                        resource_type: "db/dynamodb",
                        ...resource,
                    };
                    
                    const data = {
                        id: RID(),
                        name: JSON.stringify(data_)
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${extractDomain(apiUrl)}',
                            path: '/v3/ledger/create',
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

    const createLambdaCrudApiLambda = new aws.lambda.Function(
        `create-lambda-crud-api-lambda-${rid}`,
        {
            code: new pulumi.asset.AssetArchive({
                "index.js": new pulumi.asset.StringAsset(`

const https = require('https');

const isBase64 = (str) => {
    try {
        // Check if decoded string is the same as the original string. 
        // If so, it's likely not a valid base64 encoded string.
        return Buffer.from(str, 'base64').toString('base64') === str;
    } catch (e) {
        return false;
    }
};


const parseBody = (body) => {
    if (!body) {
        return
    }

    const type = typeof(body);
    if (type === 'object') {
        return body;
    }
    

    try {
        if (isBase64(body)) {
            const decodedBase64 = Buffer.from(body, 'base64').toString('utf8');
            return JSON.parse(decodedBase64);
            }
        // stringified JSON
        return JSON.parse(body)
    } catch (err) {
            
        

        // url encoded
        const decodedString = Buffer.from(body, 'base64').toString('utf8');
            
        const inputString = decodedString
        
        // Splitting by '&' to get key-value pairs
        const keyValuePairs = inputString.split('&').map(pair => pair.split('='));
                
        // Convert 2D array to object and decode each URL encoding value 
        const resultObject = keyValuePairs.reduce((obj, [key, value]) => {
            obj[key] = decodeURIComponent(value);
            return obj;
        }, {});

        return resultObject;
    }
};
                
                
const RID = (l = 8) => {
    const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rid = '';
    for (let i = 0; i < l; i += 1) {
        const r = Math.random() * c.length;
        rid += c.substring(r, r + 1);
    }
    return rid;
};

const createLambdaPostRequest = (lambdaName, code) => {
    const data = {
        apiID: "${apiID}",
        apiName: "${apiName}",
        lambdaResourceId: "${lambdaResourceId}",
        lambdaName: lambdaName,
        code:code,
        rid: "${rid}",
        executionArn: "${executionArn}",
        lam_role_arn: "${lam_role_arn}",
    };

    return new Promise((resolve, reject) => {
        const options = {
            host: '${_webhub_host}',
            path: '/api/deploy/lambdaAPI',
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

const savelambdaToLedger = (resource) => {
    const data_ = {
        resource_type: "lambda",
        ...resource,
    };
    
    const data = {
        id: RID(),
        name: JSON.stringify(data_)
    };

    return new Promise((resolve, reject) => {
        const options = {
            host: '${extractDomain(apiUrl)}',
            path: '/v3/ledger/create',
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
    const { lambdaName } = event.pathParameters || {};
    
    const bodyObj = parseBody(event.body);
    
    const code=  bodyObj.code

    const createLambdaResult = await createLambdaPostRequest(lambdaName, code)
        .then(responseData => {
            // console.log('Response data:', responseData);
            try {
            const obj = JSON.parse(responseData);
            if (obj.type === 'success') {
                const {
                lambdaName: { value: lambdaName },
                unique_lambda_name: { value: unique_lambda_name },
                } = obj['0']['outputs'];
                return { type: 'success', resource: { lambdaName, unique_lambda_name, date_created: new Date() } }
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
        
    if (createLambdaResult.type === 'success') {
        const lambdaLedgerResult = await savelambdaToLedger(createLambdaResult.resource)
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
            lambdaLedgerResult,
            complete: true,
        }
    
    }
    return {
        createLambdaResult,
        complete: false,
    }
};
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs18.x",
            timeout: 120, 
        }
    );

    // lambda test event
    // {
    //     "pathParameters": {
    //         "bucket-name": "ricky6666"
    //     }
    // }

    const createS3CrudApiLambda = new aws.lambda.Function(
        `create-s3-crud-api-lambda-${rid}`,
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

                const response = ({ body, status }) => {
                    return {
                        statusCode: status,
                        body: JSON.stringify({ body }),
                    };
                }

                const createS3PostRequest = (bucketName) => {
                    const data = {
                        apiID: "${apiID}",
                        apiName: "${apiName}",
                        s3ResourceId: "${s3ResourceId}",
                        bucketName: bucketName,
                        rid: "${rid}",
                        executionArn: "${executionArn}",
                        lam_role_arn: "${lam_role_arn}",
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${_webhub_host}',
                            path: '/api/deploy/s3API',
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

                const saveS3ToLedger = (resource) => {
                    const data_ = {
                        resource_type: "db/s3",
                        ...resource,
                    };
                    
                    const data = {
                        id: RID(),
                        name: JSON.stringify(data_)
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${extractDomain(apiUrl)}',
                            path: '/v3/ledger/create',
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
                    const { 'bucket-name': bucketName } = event.pathParameters || {};
                    const createS3Result = await createS3PostRequest(bucketName)
                        .then(responseData => {
                            // console.log('Response data:', responseData);
                            try {
                            const obj = JSON.parse(responseData);
                            if (obj.type === 'success') {
                                const {
                                    unique_bucket_name: { value: unique_bucketName },
                                } = obj['0']['outputs'];
                                return { type: 'success', resource: { bucketName, uniqueBucketName: unique_bucketName, date_created: new Date() } }
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
                        
                    if (createS3Result.type === 'success') {
                        const s3LedgerResult = await saveS3ToLedger(createS3Result.resource)
                            .then(responseData => {
                                // console.log('Response data:', responseData);
                                return { type: 'success', responseData }
                            })
                            .catch(err => {
                                // console.error('Error:', err);
                                // throw err; // Re-throw the error to be caught by the Lambda handler
                                return { type: 'error', err }
                            });
                        
                        return response({
                            body: {
                                s3LedgerResult,
                                complete: true,
                            },
                            status: 200,
                        });
                    
                    }
                    
                    return response({
                        body: {
                            createS3Result,
                            complete: false,
                        },
                        status: 409,
                    });
                };
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs14.x",
            timeout: 120, 
        }
    );

    // lambda test event
    // {
    //     "pathParameters": {
    //         "oauth-name": "ricky6666"
    //     }
    // }

    const createServiceAuthGoogleLambda = new aws.lambda.Function(
        `create-service-auth-google-lambda-${rid}`,
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

                const createGoogleAuthPostRequest = (oauthName) => {
                    const data = {
                        apiID: "${apiID}",
                        apiName: "${apiName}",
                        googleResourceId: "${googleResourceId}",
                        oauthName: googleAuthName,
                        rid: "${rid}",
                        executionArn: "${executionArn}",
                        lam_role_arn: "${lam_role_arn}",
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${_webhub_host}',
                            path: '/api/deploy/dynamoDBAPI',
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

                const saveGoogleAuthToLedger = (resource) => {
                    const data_ = {
                        resource_type: "auth/google",
                        ...resource,
                    };
                    
                    const data = {
                        id: RID(),
                        name: JSON.stringify(data_)
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${extractDomain(apiUrl)}',
                            path: '/v3/ledger/create',
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
                    const { 'oauth-name': oauthName } = event.pathParameters || {};
                    const createGoogleAuthResult = await createGoogleAuthPostRequest(oauthName)
                        .then(responseData => {
                            // console.log('Response data:', responseData);
                            try {
                            const obj = JSON.parse(responseData);
                            if (obj.type === 'success') {
                                const {
                                dbName: { value: db_name },
                                unique_db_name: { value: unique_dbname },
                                } = obj['0']['outputs'];
                                return { type: 'success', resource: { oauth_name, unique_oauth_name: undefined, date_created: new Date() } }
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
                        
                    if (createGoogleAuthResult.type === 'success') {
                        const googleAuthLedgerResult = await saveGoogleAuthToLedger(createGoogleAuthResult.resource)
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
                            googleAuthLedgerResult,
                            complete: true,
                        }
                    
                    }
                    return {
                        createGoogleAuthResult,
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

    /* lambda test event
    {
        "pathParameters": {
            "name": "ricky6666"
        }
    }
    */

    const createServicePaymentStripeLambda = new aws.lambda.Function(
        `create-service-payment-stripe-lambda-${rid}`,
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

                const createPaymentStripePostRequest = (name, stripeApiSecret) => {
                    const data = {
                        apiID: "${apiID}",
                        apiName: "${apiName}",
                        stripeResourceId: "${stripeResourceId}",
                        stripeName: name,
                        rid: "${rid}",
                        executionArn: "${executionArn}",
                        stripeApiSecret: stripeApiSecret,
                        stripeLayerArn: "${stripeLayerArn}",
                        lam_role_arn: "${lam_role_arn}",
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${_webhub_host}',
                            path: '/api/deploy/stripeAPI',
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

                const savePaymentStripeToLedger = (resource) => {
                    const data_ = {
                        resource_type: "payment/stripe",
                        ...resource,
                    };
                    
                    const data = {
                        id: RID(),
                        name: JSON.stringify(data_)
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${extractDomain(apiUrl)}',
                            path: '/v3/ledger/create',
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

                const parseBody = (body) => {
                    if (!body) {
                        return
                    }
                
                    const type = typeof(body);
                    if (type === 'object') {
                        return body;
                    }
                
                    try {
                        // stringified JSON
                        return JSON.parse(body)
                    } catch (err) {
                
                        // url encoded
                        const decodedString = Buffer.from(body, 'base64').toString('utf8');
                            
                        const inputString = decodedString
                        
                        // Splitting by '&' to get key-value pairs
                        const keyValuePairs = inputString.split('&').map(pair => pair.split('='));
                                
                        // Convert 2D array to object and decode each URL encoding value 
                        const resultObject = keyValuePairs.reduce((obj, [key, value]) => {
                            obj[key] = decodeURIComponent(value);
                            return obj;
                        }, {});
                
                        return resultObject;
                    }
                };

                exports.handler = async (event) => {
                    const { name } = event.pathParameters || {};
                    // Parse the request body
                    const { stripeApiSecret } = parseBody(event.body) || {};
                    const createPaymentStripeResult = await createPaymentStripePostRequest(name, stripeApiSecret)
                        .then(responseData => {
                            // console.log('Response data:', responseData);
                            try {
                            const obj = JSON.parse(responseData);
                            if (obj.type === 'success') {
                                const {
                                dbName: { value: db_name },
                                unique_db_name: { value: unique_dbname },
                                } = obj['0']['outputs'];
                                return { type: 'success', resource: { oauth_name, unique_oauth_name: undefined, date_created: new Date() } }
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
                        
                    if (createPaymentStripeResult.type === 'success') {
                        const paymentStripeToLedgerResult = await savePaymentStripeToLedger(createPaymentStripeResult.resource)
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
                            paymentStripeToLedgerResult,
                            complete: true,
                        }
                    
                    }
                    return {
                        createPaymentStripeResult,
                        complete: false,
                    }
                };
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs18.x",
            timeout: 120, 
        }
    );

    // lambda test event
    // {
    //     "pathParameters": {
    //         "name": "ricky6666"
    //     }
    // }

    const createServiceEmailSendGridLambda = new aws.lambda.Function(
        `create-service-email-sendgrid-lambda-${rid}`,
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

                const createEmailSendGridPostRequest = (name) => {
                    const data = {
                        apiID: "${apiID}",
                        apiName: "${apiName}",
                        sendgridResourceId: "${sendgridResourceId}",
                        emailName: name,
                        rid: "${rid}",
                        executionArn: "${executionArn}",
                        lam_role_arn: "${lam_role_arn}",
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${_webhub_host}',
                            path: '/api/deploy/dynamoDBAPI',
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

                const saveEmailSendGridToLedger = (resource) => {
                    const data_ = {
                        resource_type: "email/sendgrid",
                        ...resource,
                    };
                    
                    const data = {
                        id: RID(),
                        name: JSON.stringify(data_)
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${extractDomain(apiUrl)}',
                            path: '/v3/ledger/create',
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
                    const { name } = event.pathParameters || {};
                    const createEmailSendGridResult = await createEmailSendGridPostRequest(name)
                        .then(responseData => {
                            // console.log('Response data:', responseData);
                            try {
                            const obj = JSON.parse(responseData);
                            if (obj.type === 'success') {
                                const {
                                dbName: { value: db_name },
                                unique_db_name: { value: unique_dbname },
                                } = obj['0']['outputs'];
                                return { type: 'success', resource: { oauth_name, unique_oauth_name: undefined, date_created: new Date() } }
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
                        
                    if (createEmailSendGridResult.type === 'success') {
                        const emailSendGridToLedgerResult = await saveEmailSendGridToLedger(createEmailSendGridResult.resource)
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
                            emailSendGridToLedgerResult,
                            complete: true,
                        }
                    
                    }
                    return {
                        createEmailSendGridResult,
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


    const createServiceWebsocketLambda = new aws.lambda.Function(
        `create-service-websocket-lambda-${rid}`,
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

                const createWebsocketPostRequest = (name) => {
                    const data = {
                        apiID: "${apiID}",
                        // apiName: "${apiName}",
                        websocketResourceId: "${websocketResourceId}",
                        socketName: name,
                        rid: "${rid}",
                        // executionArn: "${executionArn}",
                        lam_role_arn: "${lam_role_arn}",
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${_webhub_host}',
                            path: '/api/deploy/websocketAPI',
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

                const saveWebsocketToLedger = (resource) => {
                    const data_ = {
                        resource_type: "websocket",
                        ...resource,
                    };
                    
                    const data = {
                        id: RID(),
                        name: JSON.stringify(data_)
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${extractDomain(apiUrl)}',
                            path: '/v3/ledger/create',
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
                    const { name } = event.pathParameters || {};
                    const createWebsocketResult = await createWebsocketPostRequest(name)
                        .then(responseData => {
                            // console.log('Response data:', responseData);
                            try {
                            const obj = JSON.parse(responseData);
                            if (obj.type === 'success') {
                                const {
                                socketName: { value: socket_name },
                                unique_socket_name: { value: unique_socket_name },
                                } = obj['0']['outputs'];
                                return { type: 'success', resource: { wsName, unique_socket_name, date_created: new Date() } }
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
                        
                    if (createWebsocketResult.type === 'success') {
                        const websocketToLedgerResult = await saveWebsocketToLedger(createWebsocketResult.resource)
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
                            websocketToLedgerResult,
                            complete: true,
                        }
                    
                    }
                    return {
                        createWebsocketResult,
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


    /*
    **  INTEGRATIONS
    */

    const integrationCreateServiceDBName = new aws.apigateway.Integration(`create-service-dbname-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceDBNameResource.id,
        httpMethod: methodCreateServiceDBName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createDynamoDBCrudApiLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServiceDBNameResource,
        methodCreateServiceDBName,
        createDynamoDBCrudApiLambda,
    ]});

    const integrationCreateServiceMongoDBName = new aws.apigateway.Integration(`create-service-mongo-dbname-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceMongoDBNameResource.id,
        httpMethod: methodCreateServiceDBName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createMongoDBApiLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServiceMongoDBNameResource,
        methodCreateServiceDBName,
        createMongoDBApiLambda,
    ]});

    const integrationCreateServiceLambda = new aws.apigateway.Integration(`create-service-lambda-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceLambdaNameResource.id,
        httpMethod: methodCreateServiceLambda.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createLambdaCrudApiLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServiceLambdaNameResource,
        methodCreateServiceLambda,
        createLambdaCrudApiLambda,
    ]});

    const integrationCreateServiceBucketName = new aws.apigateway.Integration(`create-service-bucket-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceBucketNameResource.id,
        httpMethod: methodCreateServiceBucketName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createS3CrudApiLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServiceBucketNameResource,
        methodCreateServiceBucketName,
        createS3CrudApiLambda,
    ]});

    const integrationCreateServiceOAuthName = new aws.apigateway.Integration(`create-service-oauth-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceOAuthNameResource.id,
        httpMethod: methodCreateServiceOAuthName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createServiceAuthGoogleLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServiceOAuthNameResource,
        methodCreateServiceOAuthName,
        createServiceAuthGoogleLambda,
    ]});

    const integrationCreateServicePaymentStripeName = new aws.apigateway.Integration(`create-service-payment-stripe-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServicePaymentStripeNameResource.id,
        httpMethod: methodCreateServicePaymentStripeName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createServicePaymentStripeLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServicePaymentStripeNameResource,
        methodCreateServicePaymentStripeName,
        createServicePaymentStripeLambda,
    ]});

    const integrationCreateServiceEmailSendGridName = new aws.apigateway.Integration(`create-service-email-sendgrid-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceEmailSendGridNameResource.id,
        httpMethod: methodCreateServiceEmailSendGridName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createServiceEmailSendGridLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServiceEmailSendGridNameResource,
        methodCreateServiceEmailSendGridName,
        createServiceEmailSendGridLambda,
    ]});

    const integrationCreateServiceWebsocketName = new aws.apigateway.Integration(`create-service-websocket-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceWebsocketNameResource.id,
        httpMethod: methodCreateServiceWebsocketName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createServiceWebsocketLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServiceWebsocketNameResource,
        methodCreateServiceWebsocketName,
        createServiceWebsocketLambda,
    ]});


    /*
    **  LAMBDA PERMISSIONS
    */

    const createServiceDBNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-dbname-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createDynamoDBCrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createDynamoDBCrudApiLambda,
    ]});

    const createServiceMongoDBNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-mongodb-dbname-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createMongoDBApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createMongoDBApiLambda,
    ]});

    const createServiceLambdaApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-lambda-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createLambdaCrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createLambdaCrudApiLambda,
    ]});

    const createServiceBucketNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-bucket-name-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createS3CrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createS3CrudApiLambda,
    ]});

    const createServiceAuthGoogleApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-auth-google-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createServiceAuthGoogleLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createServiceAuthGoogleLambda,
    ]});

    const createServicePaymentStripeApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-payment-stripe-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createServicePaymentStripeLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createServicePaymentStripeLambda,
    ]});

    const createServiceEmailSendGridApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-email-sendgrid-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createServiceEmailSendGridLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createServiceEmailSendGridLambda,
    ]});

    const createServiceWebsocketApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-websocket-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createServiceWebsocketLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createServiceWebsocketLambda,
    ]});


    /*
    **  DEPLOYMENT
    */

    const deployment = new aws.apigateway.Deployment(`crud-dynamic-endpoints-deployment-${rid}`, {
        restApi: apiID,
        stageName: "v3", // Uncomment this line if you want to specify a stage name.
    }, { dependsOn: [
        // create/service/db/dynamodb/{dbname}
        methodCreateServiceDBName, integrationCreateServiceDBName,
        // create/service/db/mongodb/{dbname}
        methodCreateServiceMongoDBName, integrationCreateServiceMongoDBName,
        // create/service/db/s3/{bucket-name}
        methodCreateServiceBucketName, integrationCreateServiceBucketName,
        // create/service/auth/google/{oauth-name}
        methodCreateServiceOAuthName, integrationCreateServiceOAuthName,
        // create/service/payment/stripe/{name}
        methodCreateServicePaymentStripeName, integrationCreateServicePaymentStripeName,
        // create/service/email/sendgrid/{name}
        methodCreateServiceEmailSendGridName, integrationCreateServiceEmailSendGridName,
        // create/service/lambda/{name}
        methodCreateServiceLambda, integrationCreateServiceLambda,
        // create/service/websocket/{name}
        methodCreateServiceWebsocketName, integrationCreateServiceWebsocketName,
    ] });
    
    return { apiID, apiName, rootResourceId, mongodbResourceId, dbResourceId, executionArn, rid };
};

export default handler;
