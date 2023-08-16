import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID } from "../../../../../utils/utils";
const handler = async ({ apiID, apiName, stripeResourceId, stripeName, rid, executionArn, stripeApiSecret, stripe_layer_arn }) => {

    const r_id = RID(6);
    const unique_stripe_name = `${stripeName}_${r_id}`;

    // const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs']

    const stripeApiLambda = new aws.lambda.Function(`stripe-api-function-${r_id}`, {
        code: new pulumi.asset.AssetArchive({
            "index.js": new pulumi.asset.StringAsset(`const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

            exports.handler = async (event) => {
                if (!event.body) {
                    return response("Missing payment data", 400);
                }
            
                const body = JSON.parse(event.body);
                const { amount, currency = "usd", token } = body;
            
                if (!amount || !token) {
                    return response("Invalid payment data", 400);
                }
            
                try {
                    const charge = await stripe.charges.create({
                        amount: amount,
                        currency: currency,
                        source: token,
                        description: "Payment via Lambda & Stripe"
                    });
            
                    return response({
                        message: 'Payment successful!',
                        charge_id: charge.id
                    }, 200);
                } catch (error) {
                    return response('Payment failed: ${error.message}', 400);
                }
            };
            
            function response(message, status) {
                return {
                    statusCode: status,
                    body: JSON.stringify({
                        message: message
                    })
                };
            }
            `),
        }),
        runtime: "nodejs18.x",
        handler: "handler.handler",
        environment: {
            variables: {
                STRIPE_SECRET_KEY: stripeApiSecret,
            },
        },
        layers: [stripe_layer_arn]  // Add the Stripe layer to your Lambda function
    });



    const folderdbNameResource = new aws.apigateway.Resource(`folder-stripe-resource-${unique_stripe_name}-${r_id}`, {
        restApi: apiID,
        parentId: stripeResourceId,
        pathPart: unique_stripe_name,
    });

    const createMethod = new aws.apigateway.Method(`create-method-${unique_stripe_name}-${r_id}`, {
        restApi: apiID,
        resourceId: folderdbNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderdbNameResource], // Make the integration dependent on the create.
    });

    const createIntegration = new aws.apigateway.Integration(`create-integration-${unique_stripe_name}-${r_id}`, {
        httpMethod: createMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderdbNameResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: stripeApiLambda.invokeArn,
    }, {
        dependsOn: [stripeApiLambda, createMethod], // Make the integration dependent on the create.
    });

    const createApiGatewayInvokePermission = new aws.lambda.Permission(`create-api-gateway-invoke-permission-${unique_stripe_name}-${r_id}`, {
        action: 'lambda:InvokeFunction',
        function: stripeApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });


    const deployment = new aws.apigateway.Deployment(`api-deployment-${unique_stripe_name}-${r_id}`, {
        restApi: apiID,
        stageName: "stage", // Uncomment this line if you want to specify a stage name.
    }, { 
        dependsOn: [ createIntegration ]
    });

    return { apiID, apiName, stripeResourceId, stripeName, unique_stripe_name };
};

export default handler;
