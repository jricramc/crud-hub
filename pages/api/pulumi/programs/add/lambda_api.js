import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import * as fs from "fs";
import * as archiver from 'archiver'; 
import { RID } from "../../../../../utils/utils";

const handler = async ({ apiID, apiName, lambdaResourceId, lambdaName, rid, code, executionArn }) => {

    const r_id = RID(6);
    const unique_lambda_name = `${lambdaName}-${r_id}`;

    // Create a role for our Lambda function
    const lam_role = new aws.iam.Role(`lambda-role-${unique_lambda_name}-${rid}`, {
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

    // Attach necessary permissions for the Lambda function (adjust as needed)
    const lam_policy = {
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: "lambda:InvokeFunction",
            Resource: "*",
        }],
    };

    new aws.iam.RolePolicy(`policy-${unique_lambda_name}-${rid}`, {
        role: lam_role.id,
        policy: JSON.stringify(lam_policy)
    });

    const lambdaRunFunc = new aws.lambda.Function(`run-func-lambda-${unique_lambda_name}-${rid}`, {
        code: new pulumi.asset.AssetArchive({
            "index.js": new pulumi.asset.StringAsset(code)

    }),  // Use FileArchive for the zipped code
        runtime: "nodejs18.x",
        handler: "index.handler",
        role: lam_role.arn,
    });

    const lambdaReadFunc = new aws.lambda.Function(`read-func-lambda-${unique_lambda_name}-${rid}`, {
        code: new pulumi.asset.AssetArchive({
            "index.js": new pulumi.asset.StringAsset(`
                exports.handler = async (event, context) => {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "${code}" }),
                };
            };
            `)

    }),  // Use FileArchive for the zipped code
        runtime: "nodejs18.x",
        handler: "index.handler",
        role: lam_role.arn,
    });

    const lambdaFunctionResource = new aws.apigateway.Resource(`folder-lambda-${unique_lambda_name}-${rid}`, {
        restApi: apiID,
        parentId: lambdaResourceId,
        pathPart: unique_lambda_name,
    });

    const lambdaRunResourcefolder = new aws.apigateway.Resource(`folder-run-lambda-${unique_lambda_name}-${rid}`, {
        restApi: apiID,
        parentId: lambdaFunctionResource.id,
        pathPart: "run",
    });

    const lambdaReadResourcefolder = new aws.apigateway.Resource(`folder-read-lambda-${unique_lambda_name}-${rid}`, {
        restApi: apiID,
        parentId: lambdaFunctionResource.id,
        pathPart: "read",
    });

    const lambdaRunMethod = new aws.apigateway.Method(`lambda-run-method-${unique_lambda_name}-${rid}`, {
        restApi: apiID,
        resourceId: lambdaRunResourcefolder.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [lambdaFunctionResource], // Make the integration dependent on the create.
    });

    const lambdaReadMethod = new aws.apigateway.Method(`lambda-read-method-${unique_lambda_name}-${rid}`, {
        restApi: apiID,
        resourceId: lambdaReadResourcefolder.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [lambdaFunctionResource], // Make the integration dependent on the create.
    });




    const lambdaRunIntegration = new aws.apigateway.Integration(`lambda-run-integration-${unique_lambda_name}-${rid}`, {
        httpMethod: lambdaRunMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: lambdaRunResourcefolder.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: lambdaRunFunc.invokeArn,
    }, {
        dependsOn: [lambdaRunFunc, lambdaRunMethod], // Make the integration dependent on the create.
    });

    const lambdaReadIntegration = new aws.apigateway.Integration(`lambda-read-integration-${unique_lambda_name}-${rid}`, {
        httpMethod: lambdaReadMethod.httpMethod,
        integrationHttpMethod: "GET",
        resourceId: lambdaReadResourcefolder.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: lambdaReadFunc.invokeArn,
    }, {
        dependsOn: [lambdaReadFunc, lambdaReadMethod], // Make the integration dependent on the create.
    });

    /* Lambda Permission */
    const createLambdaInvokePermission = new aws.lambda.Permission(`create-lambda-invoke-permission-${unique_lambda_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: lambdaRunFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const readLambdaInvokePermission = new aws.lambda.Permission(`read-lambda-invoke-permission-${unique_lambda_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: lambdaReadFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const deployment = new aws.apigateway.Deployment(`api-deployment-${unique_lambda_name}-${rid}`, {
        restApi: apiID,
        stageName: "v3", // Uncomment this line if you want to specify a stage name.
    }, { 
        dependsOn: [
            lambdaRunIntegration,
            lambdaReadIntegration
        ]
    });


    return { apiID, apiName, lambdaResourceId, lambdaName, unique_lambda_name };

    // ... rest of your integration (like associating this Lambda with an API Gateway endpoint)
};

export default handler
