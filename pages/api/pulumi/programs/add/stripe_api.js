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
    const unique_stripe_name = `${stripeName}-${r_id}`;

    // const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs']
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
                "apigateway:InvokeApi", // Invoke the API endpoint
            ],
            Resource: "*",
        }],
    };
    
    // Create a role and attach our new policy
    const lam_role = new iam.Role(`role-${unique_stripe_name}-${rid}`, {
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

    new iam.RolePolicy(`policy-${unique_stripe_name}-${rid}`, {
        role: lam_role.id,
        policy: JSON.stringify(lam_policy)
    });

    const stripeApiLambda = new aws.lambda.Function(`stripe-api-function-${r_id}`, {
        code: new pulumi.asset.AssetArchive({
            "index.js": new pulumi.asset.StringAsset(`const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
if (!event.body) {
    return response("Missing payment data", 400);
}
 
// Parse the body data: usually URL - encoded data
// Parse the URL-encoded data
const body = parseBody(event.body);
const { amount, currency = "usd", token } = body;
        
if (!amount || !token) {
    return response("Invalid payment data", 400 );
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
        return response(error.message, 400);
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

function response(message, status) {
    return {
        statusCode: status,
        body: JSON.stringify({
            message: message
        })
    };
}`),
        }),
        runtime: "nodejs18.x",
        handler: "index.handler",
        role: lam_role.arn,
        environment: {
            variables: {
                STRIPE_SECRET_KEY: stripeApiSecret,
            },
        },
        layers: ["arn:aws:lambda:us-east-2:442052175141:layer:stripe-layer:1"], // Add the Stripe layer to your Lambda function
    });



    const folderstripeNameResource = new aws.apigateway.Resource(`folder-stripe-resource-${unique_stripe_name}-${r_id}`, {
        restApi: apiID,
        parentId: stripeResourceId,
        pathPart: unique_stripe_name,
    });

    const createMethod = new aws.apigateway.Method(`create-method-${unique_stripe_name}-${r_id}`, {
        restApi: apiID,
        resourceId: folderstripeNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderstripeNameResource], // Make the integration dependent on the create.
    });

    const createIntegration = new aws.apigateway.Integration(`create-integration-${unique_stripe_name}-${r_id}`, {
        httpMethod: createMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderstripeNameResource.id,
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
    },{
        dependsOn: [stripeApiLambda],
    });


    const deployment = new aws.apigateway.Deployment(`api-deployment-${unique_stripe_name}-${r_id}`, {
        restApi: apiID,
        stageName: "v3", // Uncomment this line if you want to specify a stage name.
    }, { 
        dependsOn: [ createMethod, createIntegration ]
    });

    return { apiID, apiName, stripeResourceId, stripeName, unique_stripe_name };
};

export default handler;
