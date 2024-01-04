import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID } from "../../../../../utils/utils";

const handler = async ({ rid }) => {

    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs', 'zip']
     
    let layer = new aws.lambda.LayerVersion("stripe-lambda-layer", {
        compatibleRuntimes: ['nodejs18.x'],
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "stripe-layer1.zip")), // Direct reference to the ZIP file
        layerName: "stripe-layer",
        description: "A layer for stripe integration",
    });


    const table = new dynamodb.Table(`ledger-table-${rid}`, {
        attributes: [
            { name: "id", type: "S" },
        ],
        hashKey: "id",
        billingMode: "PAY_PER_REQUEST",
    });

    // Create an S3 bucket
    const ledger_s3_bucket_name = `ledger-s3-bucket-${rid}`.toLocaleLowerCase();
    const bucket = new aws.s3.Bucket(ledger_s3_bucket_name, {
        bucket: ledger_s3_bucket_name,
    });

    // Create IAM Role for Lambda
    const lam_s3_role = new aws.iam.Role(`ledger-s3-lambda-role-${rid}`, {
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

    const { region, accountId } =  {
        region: 'us-east-2',
        accountId: '442052175141',
    }; // extractRegionAndAccountIdFromExecutionArn(executionArn);

    const generateMintlifyDocsLambdaName = `ledger-mintlify-docs-function-${rid}`;

    // Attach necessary policies to the Lambda role
    const lambdaExecutionPolicy = new aws.iam.Policy(`ledger-s3-lambda-exec-policy-${rid}`, {
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Effect: "Allow",
                Action: "lambda:InvokeFunction",
                Resource: `arn:aws:lambda:${region}:${accountId}:function:${generateMintlifyDocsLambdaName}`,
            }],
        }),
    });

    const lambdaRolePolicyAttachment = new aws.iam.RolePolicyAttachment(`ledger-lam-rle-policy-attchmnt-${rid}`, {
        policyArn: lambdaExecutionPolicy.arn,
        role: lam_s3_role.name,
    }, { dependsOn: [
        lambdaExecutionPolicy,
        lam_s3_role
    ]});

    // Define an S3 policy to grant access to the bucket
    const s3AccessPolicy = new aws.iam.Policy(`ledger-s3-access-policy-${rid}`, {
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    "Effect": "Allow",
                    Action: [
                        "s3:ListBucket",
                        "s3:GetBucketLocation"
                    ],
                    Resource: [
                        `arn:aws:s3:::${ledger_s3_bucket_name}`,
                    ],
                },
                {
                    "Effect": "Allow",
                    Action: [
                        "s3:PutObject",
                        "s3:GetObject"
                    ],
                    Resource: [
                        `arn:aws:s3:::${ledger_s3_bucket_name}/*`,
                    ],
                },
            ],
        }),
    });

    const s3AccessPolicyAttachment = new aws.iam.PolicyAttachment(`ledger-s3-access-policy-attachment-${rid}`, {
        policyArn: s3AccessPolicy.arn,
        roles: [lam_s3_role],
    }, { dependsOn: [
        s3AccessPolicy,
        lam_s3_role
    ]});


    // Define a policy to access DynamoDB
    const lam_policy = {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    // DynamoDB actions
                    "dynamodb:PutItem",     // Create
                    "dynamodb:GetItem",     // Read
                    "dynamodb:UpdateItem",  // Update
                    "dynamodb:DeleteItem",  // Delete
                    "dynamodb:Scan",        // Scan is often used to read all items
                    "dynamodb:Query",       // Query is often used with indexes
                ],
                Resource: "*",
            },
            {
                Effect: "Allow",
                Action: [
                    // CloudWatch Logs actions
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                ],
                Resource: "*",
            },
        ],
    };
    
    // Create a role and attach our new policy
    const lam_role = new iam.Role(`lam-role-${rid}`, {
        assumeRolePolicy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "sts:AssumeRole",
                    Principal: {
                        Service: "lambda.amazonaws.com",
                    },
                    Effect: "Allow",
                },
            ],
        }),
    });

    new iam.RolePolicy(`role-policy-${rid}`, {
        role: lam_role.id,
        policy: JSON.stringify(lam_policy)
    }, { dependsOn: [
        lam_role,
        lam_policy,
    ]});





    // Define a new Lambda function
    const createFunc = new aws.lambda.Function(`ledger-create-function-${rid}`, {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "handler.zip")),
        runtime: "nodejs14.x",
        handler: "handler.createHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    }, { dependsOn: [
        lam_role,
    ]});

    
    const readFunc = new aws.lambda.Function(`ledger-read-function-${rid}`, {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "read.zip")),
        runtime: "nodejs14.x",
        handler: "read.readHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    }, { dependsOn: [
        lam_role,
    ]});
    
    const updateFunc = new aws.lambda.Function(`ledger-update-function-${rid}`, {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "update.zip")),
        runtime: "nodejs14.x",
        handler: "update.updateHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    }, { dependsOn: [
        lam_role
    ]});
    
    const deleteFunc = new aws.lambda.Function(`ledger-delete-function-${rid}`, {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "delete.zip")),
        runtime: "nodejs14.x",
        handler: "delete.deleteHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    }, { dependsOn: [
        lam_role
    ]});

    const generateMintlifyDocsFunc = new aws.lambda.Function(generateMintlifyDocsLambdaName, {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "mintlify.zip")),
        runtime: "nodejs14.x",
        handler: "mintlify.handler",
        role: lam_s3_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
                BUCKET_NAME: ledger_s3_bucket_name,
            },
        },
        layers: ["arn:aws:lambda:us-east-2:442052175141:layer:archive-layer:1"], // Add the Archive layer to your Lambda function
    }, { dependsOn: [
        lam_s3_role,
    ]});


    // Create a new Rest API Gateway using awsx.
    const api = new apigateway.RestAPI(`ledger-crud-api-${rid}`, {
        stageName: "v3",
        routes: [
            { path: "/ledger/create", method: "POST", eventHandler: createFunc },
            { path: "/ledger/read", method: "POST", eventHandler: readFunc },
            { path: "/ledger/update", method: "POST", eventHandler: updateFunc },
            { path: "/ledger/delete", method: "POST", eventHandler: deleteFunc },
            { path: "/ledger/generate/mintlify-docs", method: "POST", eventHandler: generateMintlifyDocsFunc },
        ],
    }, { dependsOn: [
        createFunc,
        readFunc,
        updateFunc,
        deleteFunc,
        generateMintlifyDocsFunc,
    ]});

    const { api: { id: restApiId, name: apiName, rootResourceId, executionArn } } = api;
    

    /*
    ** ROOT RESOURCES
    */

    /*
        /db
    */
    const folderMainDBResource = new aws.apigateway.Resource(`folder-Main-DB-Resource-${rid}`, {
        restApi: restApiId,
        parentId: rootResourceId,
        pathPart: "db",
    }, { dependsOn: [
        api,
    ]});
    
    /*
        /db/dynamodb
    */
    const folderMainDynamoDBResource = new aws.apigateway.Resource(`folder-Main-DynamoDB-Resource-${rid}`, {
        restApi: restApiId,
        parentId: folderMainDBResource.id,
        pathPart: "dynamodb",
    }, { dependsOn: [
        api,
        folderMainDBResource,
    ]});

    /*
        /db/mongodb
    */
    const folderMainMongoDBResource = new aws.apigateway.Resource(`folder-Main-MongoDB-Resource-${rid}`, {
        restApi: restApiId,
        parentId: folderMainDBResource.id,
        pathPart: "mongodb",
    }, { dependsOn: [
        api,
        folderMainDBResource,
    ]});

    /*
        /db/s3
    */
    const folderMainS3Resource = new aws.apigateway.Resource(`folder-Main-S3-Resource-${rid}`, {
        restApi: restApiId,
        parentId: folderMainDBResource.id,
        pathPart: "s3",
    }, { dependsOn: [
        api,
        folderMainDBResource,
    ]});

    const folderMainLambdaResource = new aws.apigateway.Resource(`folder-Lambda-Resource-${rid}`, {
        restApi: restApiId,
        parentId: rootResourceId,
        pathPart: "lambda",
    }, { dependsOn: [
        api,
    ]});

    /*
        /payment
    */
    const folderMainPaymentResource = new aws.apigateway.Resource(`folder-Main-Payment-Resource-${rid}`, {
        restApi: restApiId,
        parentId: rootResourceId,
        pathPart: "payment",
    }, { dependsOn: [
        api,
    ]});

    /*
        /payment/stripe
    */
    const folderMainStripeResource = new aws.apigateway.Resource(`folder-Main-Stripe-Resource-${rid}`, {
        restApi: restApiId,
        parentId: folderMainPaymentResource.id,
        pathPart: "stripe",
    }, { dependsOn: [
        api,
        folderMainPaymentResource,
    ]});

    /*
        /auth
    */
    const folderMainAuthResource = new aws.apigateway.Resource(`folder-Main-Auth-Resource-${rid}`, {
        restApi: restApiId,
        parentId: rootResourceId,
        pathPart: "auth",
    }, { dependsOn: [
        api,
    ]});

    /*
        /auth/google
    */
    const folderMainGoogleResource = new aws.apigateway.Resource(`folder-Main-Google-Resource-${rid}`, {
        restApi: restApiId,
        parentId: folderMainAuthResource.id,
        pathPart: "google",
    }, { dependsOn: [
        api,
        folderMainAuthResource,
    ]});

    /*
        /websockets
    */
    const folderMainWebsocketResource = new aws.apigateway.Resource(`folder-Main-Websocket-Resource-${rid}`, {
        restApi: restApiId,
        parentId: rootResourceId,
        pathPart: "websocket",
    }, { dependsOn: [
        api,
    ]});

    /*
        /email
    */
    // const folderMainEmailResource = new aws.apigateway.Resource(`folder-Main-Email-Resource-${rid}`, {
    //     restApi: restApiId,
    //     parentId: rootResourceId,
    //     pathPart: "email",
    // });

    // /*
    //     /email/sengrid
    // */
    // const folderMainSendGridResource = new aws.apigateway.Resource(`folder-Main-SendGrid-Resource-${rid}`, {
    //     restApi: restApiId,
    //     parentId: folderMainEmailResource.id,
    //     pathPart: "sendgrid",
    // });

    return {
        url: api.url,
        api,
        apiID: restApiId,
        apiName,
        rootResourceId,
        lambdaResourceId: folderMainLambdaResource.id,
        dbResourceId: folderMainDynamoDBResource.id,
        mongodbResourceId: folderMainMongoDBResource.id,
        s3ResourceId: folderMainS3Resource.id,
        stripeResourceId: folderMainStripeResource.id,
        googleResourceId: folderMainGoogleResource.id,
        websocketResourceId: folderMainWebsocketResource.id,
        sendgridResourceId: null, // folderMainSendGridResource.id,
        lam_role,
        executionArn,
        rid,
        stripeLayerArn: layer.arn
    };
};


export default handler;
