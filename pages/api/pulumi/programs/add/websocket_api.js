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

const handler = async ({ socketName, websocketResourceId, rid, lam_role_arn }) => {

    const r_id = RID(6);
    const unique_socket_name = `${socketName}-${r_id}`;
    const wsStage = `stage-${unique_socket_name}-${rid}`;

    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs', 'zip']

    // Create API Gatewayv2 WebSocket API
    const websocketAPI = new aws.apigatewayv2.Api(`websocketAPI-${unique_socket_name}-${rid}`, {
        protocolType: "WEBSOCKET",
        routeSelectionExpression: "${request.body.action}",
    });

    const websocketEndpoint = websocketAPI.apiEndpoint;

    // Create websocket lambda function

    const websocketFunc = new aws.lambda.Function(
        `websocketFunc-${unique_socket_name}-${rid}`,
        {
            code: new pulumi.asset.FileArchive(path.join(...directoryArray, "websocketHandler.zip")),
            role: lam_role_arn,
            handler: "websocketHandler.handler",
            runtime: "nodejs14.x",
            timeout: 120,
            environment: {
                variables: {
                    WEBSOCKET_ENDPOINT: websocketEndpoint,
                    STAGE: wsStage,
                },
            },
            // Add layer for aws-sdk/client-apigatewaymanagementapi
            layers: ["arn:aws:lambda:us-east-2:442052175141:layer:aws-sdk_client-apigatewaymanagementapi:1"],
        }
    );

    // Create the AWS Lambda Integration for API Gateway
    const websocketIntegration = new aws.apigatewayv2.Integration(`wsIntegration-${unique_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
        integrationType: "AWS_PROXY",
        integrationUri: websocketFunc.invokeArn,
    });

    // Create API Gatewayv2 WebSocket route for $connect event
    const connectRoute = new aws.apigatewayv2.Route(`connectRoute-${unique_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
        routeKey: "$connect",
        // target: `integrations/${websocketIntegration.id}`,
        target: pulumi.interpolate`integrations/${websocketIntegration.id}`,
    }, {
        dependsOn: [websocketIntegration],
    });

    // Create API Gatewayv2 WebSocket route for $disconnect event
    const disconnectRoute = new aws.apigatewayv2.Route(`disconnectRoute-${unique_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
        routeKey: "$disconnect",
        // target: `integrations/${websocketIntegration.id}`,
        target: pulumi.interpolate`integrations/${websocketIntegration.id}`,
    }, {
        dependsOn: [websocketIntegration],
    });

    // Create API Gatewayv2 WebSocket route for "broadcast" event
    const defaultRoute = new aws.apigatewayv2.Route(`defaultRoute-${unique_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
        routeKey: "$default",
        // target: `integrations/${websocketIntegration.id}`,
        target: pulumi.interpolate`integrations/${websocketIntegration.id}`,
    }, {
        dependsOn: [websocketIntegration],
    });

    // Create the Deployment
    const websocketDeployment = new aws.apigatewayv2.Deployment(`websocketDeployment-${unique_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
    }, { dependsOn: [connectRoute, disconnectRoute, defaultRoute] });

    // Create the Stage using the Deployment
    const websocketStage = new aws.apigatewayv2.Stage(wsStage, {
        apiId: websocketAPI.id,
        autoDeploy: true,
    });


    return { websocketDeployment, websocketStage, socketName, unique_socket_name, websocketAPI, websocketEndpoint };
};

export default handler
