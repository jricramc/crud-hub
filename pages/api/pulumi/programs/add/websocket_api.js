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

const handler = async ({ socketName, rid, executionArn }) => {

    const r_id = RID(6);
    const unique_socket_name = `${socketName}-${r_id}`;
    const name_suffix = `${unique_socket_name}-${rid}`;
    const wsStage = `stage-${name_suffix}`;

    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs', 'zip']

    // Create API Gatewayv2 WebSocket API
    const websocketAPI = new aws.apigatewayv2.Api(`websocketAPI-${name_suffix}`, {
        protocolType: "WEBSOCKET",
        routeSelectionExpression: "${request.body.action}",
    });

    const websocketEndpoint = websocketAPI.apiEndpoint;

    // Create Stage
    const websocketStage = new aws.apigatewayv2.Stage(wsStage, {
        apiId: websocketAPI.id,
        autoDeploy: true,
    });

    const lambdaRole = new aws.iam.Role(`lambda-role-${name_suffix}`, {
        assumeRolePolicy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "sts:AssumeRole",
                    Effect: "Allow",
                    Principal: {
                        Service: "lambda.amazonaws.com",
                    },
                },
            ],
        }),
    });
    
    const websocketFuncName = `websocketFunc-${name_suffix}`;

    const lambdaPolicy = new aws.iam.Policy(`lambda-policy-${name_suffix}`, {
        name: `lambda-policy-${name_suffix}`,
        description: "Policy to allow WebSocket API to invoke Lambda function",
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Effect: "Allow",
                Action: "lambda:InvokeFunction",
                Resource: `arn:aws:lambda:*:*:function:${websocketFuncName}`,
            }],
        }),
    });
    
    const lambdaRolePolicyAttachment = new aws.iam.RolePolicyAttachment(`lambda-role-policy-attachment-${name_suffix}`, {
        policyArn: lambdaPolicy.arn,
        role: lambdaRole.name,
    });

    // Create websocket lambda function

    const websocketFunc = new aws.lambda.Function(
        websocketFuncName,
        {
            code: new pulumi.asset.FileArchive(path.join(...directoryArray, "websocketHandler.zip")),
            role: lambdaRole.arn,
            handler: "websocketHandler.handler",
            runtime: "nodejs16.x",
            timeout: 120,
            environment: {
                variables: {
                    WEBSOCKET_ENDPOINT: websocketEndpoint,
                    STAGE: websocketStage.name,
                },
            },
            // Add layer for aws-sdk/client-apigatewaymanagementapi
            layers: ["arn:aws:lambda:us-east-2:442052175141:layer:aws-sdk_client-apigatewaymanagementapi:1"],
        }
    );

    // Create the AWS Lambda Integration for API Gateway
    const websocketIntegration = new aws.apigatewayv2.Integration(`wsIntegration-${name_suffix}`, {
        apiId: websocketAPI.id,
        integrationType: "AWS_PROXY",
        integrationUri: websocketFunc.invokeArn,
        credentialsArn: lambdaRole.arn, // Connect the IAM Role here
    });

    // Create API Gatewayv2 WebSocket route for $connect event
    const connectRoute = new aws.apigatewayv2.Route(`connectRoute-${name_suffix}`, {
        apiId: websocketAPI.id,
        routeKey: "$connect",
        // target: `integrations/${websocketIntegration.id}`,
        target: pulumi.interpolate`integrations/${websocketIntegration.id}`,
    }, {
        dependsOn: [websocketIntegration],
    });

    // Create API Gatewayv2 WebSocket route for $disconnect event
    const disconnectRoute = new aws.apigatewayv2.Route(`disconnectRoute-${name_suffix}`, {
        apiId: websocketAPI.id,
        routeKey: "$disconnect",
        // target: `integrations/${websocketIntegration.id}`,
        target: pulumi.interpolate`integrations/${websocketIntegration.id}`,
    }, {
        dependsOn: [websocketIntegration],
    });

    // Create API Gatewayv2 WebSocket route for "broadcast" event
    const defaultRoute = new aws.apigatewayv2.Route(`defaultRoute-${name_suffix}`, {
        apiId: websocketAPI.id,
        routeKey: "$default",
        // target: `integrations/${websocketIntegration.id}`,
        target: pulumi.interpolate`integrations/${websocketIntegration.id}`,
    }, {
        dependsOn: [websocketIntegration],
    });

    // const createApiGatewayInvokePermission = new aws.lambda.Permission(`ws-api-invoke-permission-${name_suffix}`, {
    //     action: 'lambda:InvokeFunction',
    //     function: websocketFunc.name,
    //     principal: 'apigateway.amazonaws.com',
    //     sourceArn: pulumi.interpolate`${executionArn}/*/*`
    // });


    // Create the Deployment
    const websocketDeployment = new aws.apigatewayv2.Deployment(`websocketDeployment-${name_suffix}`, {
        apiId: websocketAPI.id,
    }, { dependsOn: [connectRoute, disconnectRoute, defaultRoute] });


    return { websocketDeployment, websocketStageName: websocketStage.name, socketName, unique_socket_name, websocketAPI, websocketEndpoint };
};

export default handler
