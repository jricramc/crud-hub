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

const handler = async ({ socketName, rid, lam_role_arn, websocket_endpoint = '' }) => {

    const r_id = RID(6);
    const unique_socket_name = `${socketName}-${r_id}`;

    // Create API Gatewayv2 WebSocket API
    const websocketAPI = new aws.apigatewayv2.Api(`websocketAPI-${unqiue_socket_name}-${rid}`, {
        protocolType: "WEBSOCKET",
        routeSelectionExpression: "${request.body.action}",
    });

    // Create websocket lambda function

    const websocketFunc = new aws.lambda.Function(
        `websocketFunc-${unqiue_socket_name}-${rid}`,
        {
            code: new pulumi.asset.AssetArchive({
                "index.js": new pulumi.asset.StringAsset(`
                
                import AWS from 'aws-sdk';
                let CONNECTIONS_OBJ = {};

                const ENDPOINT = process.env.WEBSOCKET_ENDPOINT;
                const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT });


                const sendToOne = async (id, body) => {
                    try {
                        await client.postToConnection({
                        'ConnectionId': id,
                        'Data': Buffer.from(JSON.stringify(body)),
                        }).promise();
                    } catch (err) {
                        console.error(err);
                    }
                };
                  
                const sendToAll = async (ids, body) => {
                    const all = ids.map(i => sendToOne(i, body));
                    return Promise.all(all);
                };


                if (!event.requestContext) {
                    return {};
                }
                
                try {
            
                    const connectionId = event.requestContext.connectionId;
                    const routeKey = event.requestContext.routeKey;
                    const body = JSON.parse(event.body || '{}');

                    switch (routeKey) {
                        case '$connect':
                            sendToOne(connectionId, body);
                            break;
                        case '$disconnect':
                            // 
                            break;
                        case '$default':
                            sendToOne(connectionId, body);
                            break;
                    }
            
                } catch (err) {
                    console.error(err);
                }
            
                return {};
                
                                
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs14.x",
            timeout: 120,
            environment: {
                variables: {
                    WEBSOCKET_ENDPOINT: websocket_endpoint,
                },
            },
        }
    );

    // Create the AWS Lambda Integration for API Gateway
    const websocketIntegration = new aws.apigatewayv2.Integration(`websocketIntegration-${unqiue_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
        integrationType: "AWS_PROXY",
        integrationUri: websocketFunc.invokeArn,
    });

    // Create API Gatewayv2 WebSocket route for $connect event
    const connectRoute = new aws.apigatewayv2.Route(`connectRoute-${unqiue_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
        routeKey: "$connect",
        target: `integrations/${websocketIntegration.id}`,
    });

    // Create API Gatewayv2 WebSocket route for $disconnect event
    const disconnectRoute = new aws.apigatewayv2.Route(`disconnectRoute-${unqiue_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
        routeKey: "$disconnect",
        target: `integrations/${websocketIntegration.id}`,
    });

    // Create API Gatewayv2 WebSocket route for "broadcast" event
    const defaultRoute = new aws.apigatewayv2.Route(`defaultRoute-${unqiue_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
        routeKey: "$default",
        target: `integrations/${websocketIntegration.id}`,
    });

    // Create the Deployment
    const websocketDeployment = new aws.apigatewayv2.Deployment(`websocketDeployment-${unqiue_socket_name}-${rid}`, {
        apiId: websocketAPI.id,
    }, { dependsOn: [connectRoute, disconnectRoute, defaultRoute] });

    // Create the Stage using the Deployment
    const websocketStage = new aws.apigatewayv2.Stage("websocketStage", {
        apiId: websocketAPI.id,
        autoDeploy: true,
    });


    return { websocketDeployment, websocketStage, socket_name: socketName, unique_socket_name, websocketAPI };
};

export default handler
