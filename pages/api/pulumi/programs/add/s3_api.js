import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID, extractRegionAndAccountIdFromExecutionArn } from "../../../../../utils/utils";
const handler = async ({ apiID, apiName, s3ResourceId, bucketName, rid, executionArn }) => {

    const r_id = RID(6);
    const unique_bucket_name = `${bucketName}-${r_id}`.toLocaleLowerCase();

    // Create an S3 bucket
    const bucket = new aws.s3.Bucket(`s3-bucket-${unique_bucket_name}-${rid}`, {
        bucket: unique_bucket_name,
    });

    // Create IAM Role for Lambda
    const lam_role = new aws.iam.Role(`lambda-role-${unique_bucket_name}-${rid}`, {
        assumeRolePolicy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Action: "sts:AssumeRole",
                Effect: "Allow",
                Principal: {
                    Service: "lambda.amazonaws.com",
                },
            }],
        }),
    });

    const { region, accountId } = extractRegionAndAccountIdFromExecutionArn(executionArn);

    const s3GetStructureFuncLambdaName = `s3-struc-func-lambda-${unique_bucket_name}-${rid}`

    // Attach necessary policies to the Lambda role
    const lambdaExecutionPolicy = new aws.iam.Policy(`s3-api-lambda-exec-policy-${unique_bucket_name}-${rid}`, {
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Effect: "Allow",
                Action: "lambda:InvokeFunction",
                Resource: `arn:aws:lambda:${region}:${accountId}:function:${s3GetStructureFuncLambdaName}`,
            }],
        }),
    });

    const lambdaRolePolicyAttachment = new aws.iam.RolePolicyAttachment(`lam-rle-policy-attchmnt-${unique_bucket_name}-${rid}`, {
        policyArn: lambdaExecutionPolicy.arn,
        role: lam_role.name,
    });

    // Define an S3 policy to grant access to the bucket
    const s3AccessPolicy = new aws.iam.Policy(`s3-access-policy-${unique_bucket_name}-${rid}`, {
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Action: [
                        "s3:GetObject",
                        "s3:PutObject",
                    ],
                    Resource: [
                        `arn:aws:s3:::${unique_bucket_name}/*`,
                    ],
                },
            ],
        }),
    });

    const s3AccessPolicyAttachment = new aws.iam.PolicyAttachment(`s3-access-policy-attachment-${unique_bucket_name}-${rid}`, {
        policyArn: s3AccessPolicy.arn,
        roles: [lam_role],
    });

    const s3GetStructureFunc = new aws.lambda.Function(
        s3GetStructureFuncLambdaName,
        {
            code: new pulumi.asset.AssetArchive({
                "index.js": new pulumi.asset.StringAsset(`
                    const AWS = require('aws-sdk');

                    exports.handler = async (event, context) => {
                        // Initialize AWS SDK
                        const s3 = new AWS.S3();
                    
                        // Specify the bucket name
                        const bucketName = process.env.BUCKET_NAME
                    
                        try {
                            // List objects in the S3 bucket
                            const listObjectsParams = {
                                Bucket: bucketName,
                            };
                    
                            const listObjectsResponse = await s3.listObjectsV2(listObjectsParams).promise();
                    
                            const fileStructure = listObjectsResponse.Contents.map(item => {
                                return {
                                    Key: item.Key,
                                    Size: item.Size,
                                    LastModified: item.LastModified,
                                };
                            });
                    
                            console.log('File structure:', fileStructure);
                    
                            return {
                                statusCode: 200,
                                body: JSON.stringify(fileStructure),
                            };
                        } catch (error) {
                            console.error('Error:', error);
                    
                            return {
                                statusCode: 500,
                                body: JSON.stringify({ err: error }),
                            };
                        }
                    };
                            
                `),
            }),
            role: lam_role.arn,
            handler: "index.handler",
            runtime: "nodejs14.x",
            timeout: 30,
            environment: {
                variables: {
                    BUCKET_NAME: unique_bucket_name,
                },
            },
        }
    );

    const s3CreatePathFunc = new aws.lambda.Function(
        `s3-create-path-func-lambda-${unique_bucket_name}-${rid}`,
        {
            code: new pulumi.asset.AssetArchive({
                "index.js": new pulumi.asset.StringAsset(`
                    const AWS = require('aws-sdk');

                    exports.handler = async (event, context) => {
                        // Initialize AWS SDK
                        const s3 = new AWS.S3();

                        // Specify the bucket name
                        const bucketName = process.env.BUCKET_NAME
                    
                        // Read the bucket name from the event body
                        let { files } = event.body;

                        // Parse event.body if it's not an object
                        if (typeof event.body === 'string') {
                            try {
                                const parsedBody = JSON.parse(event.body);
                                files = parsedBody.files;
                            } catch (error) {
                                console.error('Error parsing event body:', error);
                                return {
                                    statusCode: 400,
                                    body: JSON.stringify('Invalid event body'),
                                };
                            }
                        }
                    
                        // Retrieve the path variable from pathParameters
                        const { path } = event.pathParameters;
                    
                        try {
                            // Create the path in the S3 bucket
                            const createPathParams = {
                                Bucket: bucketName,
                                Key: path,
                            };
                    
                            await s3.putObject(createPathParams).promise();
                    
                            // Save file data if provided
                            if (files) {
                                for (const file of files) {
                                    const saveFileParams = {
                                        Bucket: bucketName,
                                        Key: path + '/' + file.name,
                                        Body: file.data,
                                    };
                                    await s3.putObject(saveFileParams).promise();
                                }
                            }
                    
                            console.log('Path and files created successfully');
                    
                            return {
                                statusCode: 200,
                                body: JSON.stringify({ type: 'success' }),
                            };
                        } catch (error) {
                            console.error('Error:', error);
                    
                            return {
                                statusCode: 500,
                                body: JSON.stringify({ type: 'error', message: 'Error creating path and saving files to S3' }),
                            };
                        }
                    }; 
                `),
            }),
            role: lam_role.arn,
            handler: "index.handler",
            runtime: "nodejs14.x",
            timeout: 30,
            environment: {
                variables: {
                    BUCKET_NAME: unique_bucket_name,
                },
            },
        }
    );
   

    /*
    **  RESOURCES
    */

    /*
        /db/s3/{unique_bucket_name}
    */
    const folderBucketNameResource = new aws.apigateway.Resource(`folder-bucket-name-resource-${unique_bucket_name}-${rid}`, {
        restApi: apiID,
        parentId: s3ResourceId,
        pathPart: unique_bucket_name,
    });

    
    /*
        /db/s3/{unique_bucket_name}/structure
    */

    const folderBucketNameStructureResource = new aws.apigateway.Resource(`folder-bucket-name-structure-resource-${unique_bucket_name}-${rid}`, {
        restApi: apiID,
        parentId: folderBucketNameResource.id,
        pathPart: "structure",
    }, {
        dependsOn: [folderBucketNameResource],
    });

    
    /*
        /db/s3/{unique_bucket_name}/create
    */

    const folderCreateResource = new aws.apigateway.Resource(`folder-bucket-name-create-resource-${unique_bucket_name}-${rid}`, {
        restApi: apiID,
        parentId: folderBucketNameResource.id,
        pathPart: "create",
    }, {
        dependsOn: [folderBucketNameResource],
    });


    /*
        /db/s3/{unique_bucket_name}/create/{path+}
    */

    const folderCreatePathResource = new aws.apigateway.Resource(`folder-bucket-name-create-path-resource-${unique_bucket_name}-${rid}`, {
        restApi: apiID,
        parentId: folderBucketNameResource.id,
        pathPart: "{path+}",
    }, {
        dependsOn: [folderBucketNameResource],
    });


    /*
    **  METHOD
    */

    const s3GetStructureMethod = new aws.apigateway.Method(`s3-get-structure-${unique_bucket_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderBucketNameStructureResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderCreateResource],
    });


    const s3CreatePathStructureMethod = new aws.apigateway.Method(`s3-create-path-${unique_bucket_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderCreatePathResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderCreatePathResource],
    });


    /*
    **  INTEGRATION
    */

    const s3GetStructureIntegration = new aws.apigateway.Integration(`s3-get-structure-integration-${unique_bucket_name}-${rid}`, {
        httpMethod: s3GetStructureMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderBucketNameStructureResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: s3GetStructureFunc.invokeArn,
    }, {
        dependsOn: [s3GetStructureFunc, s3GetStructureMethod],
    });

    const s3CreatePathStructureIntegration = new aws.apigateway.Integration(`s3-create-path-integration-${unique_bucket_name}-${rid}`, {
        httpMethod: s3CreatePathStructureMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderCreatePathResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: s3CreatePathFunc.invokeArn,
    }, {
        dependsOn: [s3CreatePathFunc, s3CreatePathStructureMethod],
    });
    


    /*
    **  LAMBDA PERMISSIONS
    */

    const s3GetStructureApiGatewayInvokePermission = new aws.lambda.Permission(`s3-get-structure-api-gateway-invoke-permission-${unique_bucket_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: s3GetStructureFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const s3CreatePathApiGatewayInvokePermission = new aws.lambda.Permission(`s3-create-path-api-gateway-invoke-permission-${unique_bucket_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: s3CreatePathFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const deployment = new aws.apigateway.Deployment(`s3-api-deployment-${unique_bucket_name}-${rid}`, {
        restApi: apiID,
        stageName: "v3", // Uncomment this line if you want to specify a stage name.
    }, { 
        dependsOn: [
            s3GetStructureIntegration,
            s3CreatePathStructureIntegration,
        ]
    });
    
    return { apiID, apiName, s3ResourceId, bucketName, unique_bucket_name, bucket };
};

export default handler;
