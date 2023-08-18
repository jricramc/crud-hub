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
    rootResourceId, dbResourceId, s3ResourceId, stripeResourceId, googleResourceId, sendgridResourceId,
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
        /create/service/payment/stripe/{name}
    */
    const folderCreateServicePaymentStripeNameResource = new aws.apigateway.Resource(`folder-create-service-payment-stripe-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServicePaymentStripeResource.id,
        pathPart: "{name}",
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
        /create/service/auth/google/{oauth-name}
    */
    const folderCreateServiceOAuthNameResource = new aws.apigateway.Resource(`folder-create-service-oauth-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceAuthGoogleResource.id,
        pathPart: "{oauth-name}",
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
    const folderCreateServiceEmailSendGridResource = new aws.apigateway.Resource(`folder-create-service-email-sendgrid-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceEmailResource.id,
        pathPart: "sendgrid",
    });

    /*
        /create/service/email/sendgrid/{name}
    */
    const folderCreateServiceEmailSendGridNameResource = new aws.apigateway.Resource(`folder-create-service-email-sendgrid-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceEmailSendGridResource.id,
        pathPart: "{name}",
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

    const methodCreateServiceOAuthName = new aws.apigateway.Method(`create-service-oauth-name-post-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceOAuthNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    const methodCreateServicePaymentStripeName = new aws.apigateway.Method(`create-service-payment-stripe-name-post-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServicePaymentStripeNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    const methodCreateServiceEmailSendGridName = new aws.apigateway.Method(`create-service-email-sendgrid-name-post-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceEmailSendGridNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    });



    /*
    **  LAMBDAS
    */

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

    // lambda test event
    // {
    //     "pathParameters": {
    //         "name": "ricky6666"
    //     }
    // }

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


                exports.handler = async (event) => {
                    const { name } = event.pathParameters || {};
                    // Parse the request body
                    const { stripeApiSecret } = JSON.parse(event.body) || {};
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
    });

    const integrationCreateServiceBucketName = new aws.apigateway.Integration(`create-service-bucket-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceBucketNameResource.id,
        httpMethod: methodCreateServiceBucketName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createS3CrudApiLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    });

    const integrationCreateServiceOAuthName = new aws.apigateway.Integration(`create-service-oauth-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceOAuthNameResource.id,
        httpMethod: methodCreateServiceOAuthName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createServiceAuthGoogleLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    });

    const integrationCreateServicePaymentStripeName = new aws.apigateway.Integration(`create-service-payment-stripe-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServicePaymentStripeNameResource.id,
        httpMethod: methodCreateServicePaymentStripeName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createServicePaymentStripeLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    });

    const integrationCreateServiceEmailSendGridName = new aws.apigateway.Integration(`create-service-email-sendgrid-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceEmailSendGridNameResource.id,
        httpMethod: methodCreateServiceEmailSendGridName.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createServiceEmailSendGridLambda.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    });


    /*
    **  LAMBDA PERMISSIONS
    */

    const createServiceDBNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-dbname-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createDynamoDBCrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const createServiceBucketNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-bucket-name-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createS3CrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const createServiceAuthGoogleApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-auth-google-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createServiceAuthGoogleLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const createServicePaymentStripeApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-payment-stripe-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createServicePaymentStripeLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const createServiceEmailSendGridApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-email-sendgrid-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createServiceEmailSendGridLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });


    /*
    **  DEPLOYMENT
    */

    const deployment = new aws.apigateway.Deployment(`crud-dynamic-endpoints-deployment-${rid}`, {
        restApi: apiID,
        stageName: "v3", // Uncomment this line if you want to specify a stage name.
    }, { dependsOn: [
        // create/service/db/dynamodb/{dbname}
        methodCreateServiceDBName, integrationCreateServiceDBName,
        // create/service/db/s3/{bucket-name}
        methodCreateServiceBucketName, integrationCreateServiceBucketName,
        // create/service/auth/google/{oauth-name}
        methodCreateServiceOAuthName, integrationCreateServiceOAuthName,
        // create/service/payment/stripe/{name}
        methodCreateServicePaymentStripeName, integrationCreateServicePaymentStripeName,
        // create/service/email/sendgrid/{name}
        methodCreateServiceEmailSendGridName, integrationCreateServiceEmailSendGridName,
    ] });
    
    return { apiID, apiName, rootResourceId, dbResourceId, executionArn, rid };
};

export default handler;
