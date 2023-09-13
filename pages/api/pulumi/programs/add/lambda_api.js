import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID } from "../../../../../utils/utils";

const handler = async ({ apiID, apiName, lambdaResourceId, lambdaName, rid, code }) => {

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

    // Create the Lambda function with the provided user code
    const lambdaFunc = new aws.lambda.Function(`user-func-lambda-${unique_lambda_name}-${rid}`, {
        code: new pulumi.asset.AssetArchive({
            'index.js': new pulumi.asset.StringAsset(code),
        }),
        runtime: "nodejs18.x",
        handler: "index.handler",
        role: lam_role.arn,
    });

    const lambdaFunctionResource = new aws.apigateway.Resource(`folder-lambda-${unique_lambda_name}-${rid}`, {
        restApi: apiID,
        parentId: lambdaResourceId,
        pathPart: unique_lambda_name,
    });

    const lambdaMethod = new aws.apigateway.Method(`lambda-method-${unique_lambda_name}-${rid}`, {
        restApi: apiID,
        resourceId: lambdaFunctionResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [lambdaFunctionResource], // Make the integration dependent on the create.
    });

    const lambdaIntegration = new aws.apigateway.Integration(`lambda-integration-${unique_lambda_name}-${rid}`, {
        httpMethod: lambdaMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderCreateResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: lambdaFunc.invokeArn,
    }, {
        dependsOn: [lambdaFunc, lambdaMethod], // Make the integration dependent on the create.
    });

    return { apiID, apiName, lambdaResourceId, lambdaName, unique_lambda_name };

    // ... rest of your integration (like associating this Lambda with an API Gateway endpoint)
};

export default handler
