import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";

import fs from 'fs';
import { RID, extractDomain } from '@/utils/utils';

const _webhub_host = extractDomain(process.env.NEXT_PUBLIC_WEBHUB_HOST || publicRuntimeConfig.NEXTAUTH_URL);

const handler = async ({
    rid, apiID, rootResourceId,
    ec2InstanceId, ec2InstanceName, ec2InstancePublicDns,
    apiName, apiUrl, lam_role_arn, executionArn, secretRid, API72_LEDGER_ACCESS_ID,
}) => {
     
    
    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs', 'sh']

    /*
    ** ROOT RESOURCES
    */

    /*
        /aws
    */
        const folderMainAWSResource = new aws.apigateway.Resource(`folder-Main-AWS-Resource-${rid}`, {
            restApi: apiID,
            parentId: rootResourceId,
            pathPart: "aws",
        },
        { dependsOn: [] });

    /*
        /aws/db
    */
    const folderMainDBResource = new aws.apigateway.Resource(`folder-Main-DB-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainAWSResource.id,
        pathPart: "db",
    },
    { dependsOn: [] });
    
    /*
        /aws/db/dynamodb
    */
    const folderMainDynamoDBResource = new aws.apigateway.Resource(`folder-Main-DynamoDB-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainDBResource.id,
        pathPart: "dynamodb",
    },
    { dependsOn: [ folderMainDBResource ] });


    /*
        /aws/db/s3
    */
    const folderMainS3Resource = new aws.apigateway.Resource(`folder-Main-S3-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainDBResource.id,
        pathPart: "s3",
    },
    { dependsOn: [ folderMainDBResource ]});


    /*
        /aws/lambda
    */
    const folderMainLambdaResource = new aws.apigateway.Resource(`folder-Lambda-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainAWSResource.id,
        pathPart: "lambda",
    },
    { dependsOn: [] });

    /*
        /aws/websocket
    */
    const folderMainWSAPIResource = new aws.apigateway.Resource(`folder-Main-WSAPI-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainAWSResource.id,
        pathPart: "websocket",
    },
    { dependsOn: [] });


    const lambdaResourceId = folderMainLambdaResource.id;
    const dynamodbResourceId = folderMainDynamoDBResource.id;
    const s3ResourceId = folderMainS3Resource.id;
    const websocketResourceId = folderMainWSAPIResource.id;



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
        /create/service/db/s3/{bucket-name}
    */
    const folderCreateServiceBucketNameResource = new aws.apigateway.Resource(`folder-create-service-bucket-name-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceDBS3Resource.id,
        pathPart: "{bucket-name}",
    }, { dependsOn: [
        folderCreateServiceDBS3Resource,
    ]});

    /*
        /create/service/cloudfrontS3
    */
    const folderCreateServiceCldfrntS3Resource = new aws.apigateway.Resource(`folder-create-service-cldfrnt-S3-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceResource.id,
        pathPart: "cloudfrontS3",
    }, { dependsOn: [
        folderCreateServiceResource,
    ]});

    /*
        /create/service/cloudfrontS3/{name}
    */
    const folderCreateServiceCldfrntS3BucketNameResource = new aws.apigateway.Resource(`flder-crte-srvce-cldfrnt-s3-bckt-nme-rsrce-${rid}`, {
        restApi: apiID,
        parentId: folderCreateServiceCldfrntS3Resource.id,
        pathPart: "{name}",
    }, { dependsOn: [
        folderCreateServiceDBS3Resource,
    ]});

    /*
        /create/service/websocket
    */
        const folderCreateServiceWSAPIResource = new aws.apigateway.Resource(`folder-create-service-wsapi-resource-${rid}`, {
            restApi: apiID,
            parentId: folderCreateServiceResource.id,
            pathPart: "websocket",
        }, { dependsOn: [
            folderCreateServiceResource,
        ]});
    
        /*
            /create/service/websocket/{ws-name}
        */
        const folderCreateServiceWSNameResource = new aws.apigateway.Resource(`folder-create-service-wsName-resource-${rid}`, {
            restApi: apiID,
            parentId: folderCreateServiceWSAPIResource.id,
            pathPart: "{ws-name}",
        }, { dependsOn: [
            folderCreateServiceWSAPIResource,
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

    const methodCreateServiceLambda = new aws.apigateway.Method(`create-service-lambda-post-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceLambdaNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceLambdaNameResource
    ]});

    const methodCreateServiceWSAPI = new aws.apigateway.Method(`create-service-wsapi-post-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceWSNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceWSNameResource
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

    const methodCreateServiceCloudfrontS3Name = new aws.apigateway.Method(`create-service-cldfrnt-s3-name-get-method-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceCldfrntS3BucketNameResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    }, { dependsOn: [
        folderCreateServiceCldfrntS3BucketNameResource,
    ]});



    /*
    **  LAMBDAS
    */

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
                        dynamodbResourceId: "${dynamodbResourceId}",
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
            runtime: "nodejs18.x",
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
            runtime: "nodejs18.x",
            timeout: 120, 
        }
    );

    const createCloudfrontS3Distribution = new aws.lambda.Function(
        `create-cldfrnt-s3-distribution-lambda-${rid}`,
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

                const createCldfrntS3PostRequest = (name) => {
                    const data = {
                        apiID: "${apiID}",
                        name,
                        rid: "${rid}",
                        executionArn: "${executionArn}",
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${_webhub_host}',
                            path: '/api/deploy/cloudfront_s3API',
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

                const saveCldfrntS3ToLedger = (resource) => {
                    const data_ = {
                        resource_type: "cloudfrontS3",
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
                    const createCldfrntS3Result = await createCldfrntS3PostRequest(name)
                        .then(responseData => {
                            // console.log('Response data:', responseData);
                            try {
                            const obj = JSON.parse(responseData);
                            if (obj.type === 'success') {
                                const {
                                    iamUser: { value: iam_user },
                                    iamUserAccessKeys: { value: iam_user_access_keys },
                                    cloudfrontDistribution: { value: cloudfront_distribution },
                                    s3Bucket: { value: s3_bucket },
                                    unique_cloudfrontS3_name: { value: unique_cloudfrontS3Name },

                                } = obj['0']['outputs'];
                                return { type: 'success', resource: { cloudfrontS3Name: name, uniqueCloudfrontS3Name: unique_cloudfrontS3Name, iam_user, iam_user_access_keys, cloudfront_distribution, s3_bucket, date_created: new Date() } }
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
                        
                    if (createCldfrntS3Result.type === 'success') {
                        const cldfrntS3LedgerResult = await saveCldfrntS3ToLedger(createCldfrntS3Result.resource)
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
                                cldfrntS3LedgerResult,
                                complete: true,
                            },
                            status: 200,
                        });
                    
                    }
                    
                    return response({
                        body: {
                            createCldfrntS3Result,
                            complete: false,
                        },
                        status: 409,
                    });
                };
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs18.x",
            timeout: 120, 
        }
    );

    const createWebsocketAPI = new aws.lambda.Function(
        `create-websocket-api-lambda-${rid}`,
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

                const createWSAPIPostRequest = (name) => {
                    const data = {
                        apiKey: "${process.env.NEXT_PUBLIC_MONGODB_API_KEY}",
                        apiID: "${apiID}",
                        apiUrl: "${apiUrl}",
                        socketName: name,
                        rid: "${rid}",
                        websocketResourceId: "${websocketResourceId}",
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
                    
                    const data = {
                        query: { 'ledger_access_id': '${API72_LEDGER_ACCESS_ID}' },
                        $set: { 'data.websocket': resource },
                    };

                    return new Promise((resolve, reject) => {
                        const options = {
                            host: '${_webhub_host}',
                            path: '/api/ledger/update',
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
                    const { 'ws-name': wsName } = event.pathParameters || {};
                    const createWebsocketAPIResult = await createWSAPIPostRequest(wsName)
                        .then(responseData => {
                            // console.log('Response data:', responseData);
                            try {
                            const obj = JSON.parse(responseData);
                            if (obj.type === 'success') {
                                const {
                                    websocketStageName: { value: websocket_stage_name },
                                    websocketAPI: { value: websocket_api },
                                    websocketEndpoint: { value: websocket_endpoint },
                                    cloudfrontDistribution: { value: cloudfront_distribution },
                                    socketName: { value: socket_name },
                                    unique_socket_name: { value: unique_socketName },

                                } = obj['0']['outputs'];
                                return { type: 'success', resource: { socketName: socket_name, uniqueSocketName: unique_socketName, websocket_stage_name, websocket_api, websocket_endpoint, date_created: new Date() } }
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
                        
                    if (createWebsocketAPIResult.type === 'success') {
                        const createWebsocketAPIResult = await saveWebsocketToLedger(createWebsocketAPIResult.resource)
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
                                createWebsocketAPIResult,
                                complete: true,
                            },
                            status: 200,
                        });
                    
                    }
                    
                    return response({
                        body: {
                            createWebsocketAPIResult,
                            complete: false,
                        },
                        status: 409,
                    });
                };
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs18.x",
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

    const integrationCreateServiceWSAPI = new aws.apigateway.Integration(`create-service-wsapi-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceWSNameResource.id,
        httpMethod: methodCreateServiceWSAPI.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createWebsocketAPI.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServiceWSNameResource,
        methodCreateServiceWSAPI,
        createWebsocketAPI,
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

    const integrationCreateServiceCloudfrontS3Name = new aws.apigateway.Integration(`create-service-cloudfront-s3-name-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateServiceCldfrntS3BucketNameResource.id,
        httpMethod: methodCreateServiceCloudfrontS3Name.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createCloudfrontS3Distribution.invokeArn,
        timeoutInMillis: 120000, // Set the integration timeout to match the Lambda timeout
    }, { dependsOn: [
        folderCreateServiceCldfrntS3BucketNameResource,
        methodCreateServiceCloudfrontS3Name,
        createCloudfrontS3Distribution,
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

    const createServiceLambdaApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-lambda-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createLambdaCrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createLambdaCrudApiLambda,
    ]});

    const createServiceWSApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-ws-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createWebsocketAPI.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createWebsocketAPI,
    ]});

    const createServiceBucketNameApiGatewayInvokePermission = new aws.lambda.Permission(`create-service-bucket-name-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createS3CrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createS3CrudApiLambda,
    ]});

    const createServiceCloudfrontS3GatewayInvokePermission = new aws.lambda.Permission(`create-service-cldfrnt-s3-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createCloudfrontS3Distribution.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    }, { dependsOn: [
        createCloudfrontS3Distribution,
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
        // create/service/db/s3/{bucket-name}
        methodCreateServiceBucketName, integrationCreateServiceBucketName,
        // create/service/cloudfrontS3
        methodCreateServiceCloudfrontS3Name, integrationCreateServiceCloudfrontS3Name,
        // create/service/lambda/{name}
        methodCreateServiceLambda, integrationCreateServiceLambda,
        // create/service/websocket/{ws-name}
        methodCreateServiceWSAPI, integrationCreateServiceWSAPI,
    ] });

    /*
        EC2 CLOUDFRONT DISTRIBUTION
    */

    let ec2Instances;

    const retryCount = 5;
    const retryDelay = 30000;
    
    for (let i = 0; i < retryCount; i += 1) {

        if (i > 0) {
            console.log(`(${i}) retry ec2.getInstances`)
            // wait 30 seconds before retrying again
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }

        

        ec2Instances = await aws.ec2.getInstances({
            instanceTags: {
                Name: ec2InstanceName,
            },
            filters: [],
            instanceStateNames: [
                "running",
            ],
        });

        if (ec2Instances?.ids?.length > 0) {
            // break
            i = retryCount;
        }
    }
    

    const originId = `origin-id-cldfrnt-dist-ec2-id-${ec2InstanceId}`;
    // Create a CloudFront distribution using the instance's public DNS name
    const ec2CloudfrontDistribution = new aws.cloudfront.Distribution(
        `ec2-instance-cldfrnt-distribution-${rid}`,
        {
            origins: [
                {
                    domainName: ec2InstancePublicDns, // This uses the public DNS of the instance
                    originId,
                    customOriginConfig: {
                        originProtocolPolicy: "http-only", // or "https-only" or "match-viewer" based on needs
                        originSslProtocols: ["SSLv3"], // ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
                        httpPort: 80, // the HTTP port your instance listens on, adjust as necessary
                        httpsPort: 443, // the HTTPS port your instance listens on, adjust as necessary
                    },
                },
            ],
            enabled: true,
            defaultCacheBehavior: {
                targetOriginId: originId,
                forwardedValues: {
                    queryString: false,
                    headers: ["*"], // Forward all headers
                    cookies: {
                        forward: "none",
                    },
                },
                viewerProtocolPolicy: "redirect-to-https", // Force HTTPS
                allowedMethods: ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
                cachedMethods: ["GET", "HEAD"],
                // other cache behavior settings
            },
            viewerCertificate: {
                cloudfrontDefaultCertificate: true, // Use the default cloudfront certificate
            },
            // Specify no restrictions for the distribution
            restrictions: {
                geoRestriction: {
                    restrictionType: "none",
                },
            },
            isIpv6Enabled: true,
            // additional CloudFront settings
        }
    );

    return {
        lambdaResourceId,
        dynamodbResourceId,
        s3ResourceId,
        websocketResourceId,
        ec2CloudfrontDistribution,
    };
};


export default handler;
