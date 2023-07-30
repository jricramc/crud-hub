import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';

const handler = async () => {

    const table = new dynamodb.Table("test0table", {
        attributes: [{
            name: "id",
            type: "S"
        }],
        hashKey: "id",
        billingMode: "PAY_PER_REQUEST",
    });

    // Define a policy to access DynamoDB
    const lam_policy = {
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: [
                "dynamodb:PutItem",     // Create
                "dynamodb:GetItem",     // Read
                "dynamodb:UpdateItem",  // Update
                "dynamodb:DeleteItem",  // Delete
                "dynamodb:Scan",        // Scan is often used to read all items
                "dynamodb:Query",       // Query is often used with indexes
            ],
            Resource: "*",
        }],
    };
    
    // Create a role and attach our new policy
    const lam_role = new iam.Role("myRole", {
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

    new iam.RolePolicy("myRolePolicy", {
        role: lam_role.id,
        policy: JSON.stringify(lam_policy)
    });



    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs']


    // Define a new Lambda function
    const createFunc = new aws.lambda.Function("createFunction", {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "handler.zip")),
        runtime: "nodejs14.x",
        handler: "handler.createHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    });

    
    const readFunc = new aws.lambda.Function("readFunction", {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "read.zip")),
        runtime: "nodejs14.x",
        handler: "read.readHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    });
    
    const updateFunc = new aws.lambda.Function("updateFunction", {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "update.zip")),
        runtime: "nodejs14.x",
        handler: "update.updateHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    });
    
    const deleteFunc = new aws.lambda.Function("deleteFunction", {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "delete.zip")),
        runtime: "nodejs14.x",
        handler: "delete.deleteHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    });

    // const testLambda = new aws.lambda.Function("mylambda", {
    //     code: new pulumi.asset.AssetArchive({
    //         "index.js": new pulumi.asset.StringAsset(`const fetch = require('node-fetch');

    //         exports.handler = async (event, context) => {
    //             try {
    //                 const response = await fetch('http://localhost:3002/api/deployNewRouteForAPI-copy', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify({ message: 'Deploying new route' }),
    //                 });
            
    //                 const data = await response.json();
            
    //                 return {
    //                     statusCode: 200,
    //                     body: JSON.stringify(data),
    //                 };
    //             } catch (error) {
    //                 console.log(error);
    //                 return {
    //                     statusCode: 500,
    //                     body: JSON.stringify({ error: 'Failed to execute request' }),
    //                 };
    //             }
    //         };
    //         `),
    //     }),
    //     role: lam_role.arn,
    //     handler: "index.handler",
    //     runtime: "nodejs14.x",
    // });

    const testLambda = new aws.lambda.Function("mylambda", {
        code: new pulumi.asset.AssetArchive({
            "index.js": new pulumi.asset.StringAsset(`
            exports.handler = async (event) => {
                const { proxy } = event.pathParameters || {}; // Extract the value of the "proxy" variable from the event
            
                const response = {
                    statusCode: 200,
                    body: JSON.stringify({ proxyValue: proxy }),
                };
            
                return response;
            };
            `),
        }),
        role: lam_role.arn,
        handler: "index.handler",
        runtime: "nodejs14.x",
    });


    // Create a new Rest API Gateway using awsx.
    const api = new apigateway.RestAPI("myApi", {
        routes: [
            { path: "/ledger/create", method: "POST", eventHandler: createFunc },
            { path: "/ledger/read", method: "POST", eventHandler: readFunc },
            { path: "/ledger/update", method: "POST", eventHandler: updateFunc },
            { path: "/ledger/delete", method: "POST", eventHandler: deleteFunc },
        ],
    });

    const { api: { id: restApiId, rootResourceId } } = api;

    const folderMainDynamoDBResource = new aws.apigateway.Resource("folder-Main-DynamoDB-Resource", {
        restApi: restApiId,
        parentId: rootResourceId,
        pathPart: "dynamodb",
    });


    const folderCreateResource = new aws.apigateway.Resource("folder-create-resource", {
        restApi: restApiId,
        parentId: rootResourceId,
        pathPart: "create",
    });
    
    const folderDynamodbResource = new aws.apigateway.Resource("folder-dynamodb-resource", {
        restApi: restApiId,
        parentId: folderCreateResource.id,
        pathPart: "dynamodb",
    });

    const folderProxyResource = new aws.apigateway.Resource("folder-proxy-resource", {
        restApi: restApiId,
        parentId: folderDynamodbResource.id,
        pathPart: "{proxy}",
    });
    
    const method = new aws.apigateway.Method("get-method", {
        restApi: restApiId,
        resourceId: folderProxyResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    const integration = new aws.apigateway.Integration("myintegration", {
        restApi: restApiId,
        resourceId: folderProxyResource.id,
        httpMethod: method.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: testLambda.invokeArn,
    });

    const deployment = new aws.apigateway.Deployment("apiDeployment", {
        restApi: restApiId,
        stageName: "stage", // Uncomment this line if you want to specify a stage name.
    }, { dependsOn: [method, integration] });
    
    return { url: api.url, api, id: restApiId, rootResourceId, dbResourceId: folderMainDynamoDBResource.id };
};

export default handler;
