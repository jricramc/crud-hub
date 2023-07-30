import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";

const handler = async ({ apiID, rootResourceId, dbResourceId, lam_role_arn, executionArn, rid }) => {

    const folderCreateResource = new aws.apigateway.Resource(`folder-create-resource-${rid}`, {
        restApi: apiID,
        parentId: rootResourceId,
        pathPart: "create",
    });
    
    const folderDynamodbResource = new aws.apigateway.Resource(`folder-dynamodb-resource-${rid}`, {
        restApi: apiID,
        parentId: folderCreateResource.id,
        pathPart: "dynamodb",
    });

    const folderDBNameResource = new aws.apigateway.Resource(`folder-dbname-resource-${rid}`, {
        restApi: apiID,
        parentId: folderDynamodbResource.id,
        pathPart: "{dbname}",
    });
    
    const method = new aws.apigateway.Method(`crud-dynamic-endpoints-get-method-${rid}`, {
        restApi: apiID,
        resourceId: folderDBNameResource.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    const createDynamoDBCrudApiLambda = new aws.lambda.Function(`create-dynamodb-crud-api-lambda-${rid}`, {
        code: new pulumi.asset.AssetArchive({
            "index.js": new pulumi.asset.StringAsset(`const fetch = require('node-fetch');

            exports.handler = async (event, context) => {
                try {
                    const { dbname } = event.pathParameters || {}; // Extract the value of the "dbname" variable from the event
                    const response = await fetch('http://localhost:3000/api/deployAddCrudAPI', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            apiID: "${apiID}",
                            dbResourceId: "${dbResourceId}",
                            dbName: dbname,
                            rid: "${rid}",
                        }),
                    });
            
                    const data = await response.json();
            
                    return {
                        statusCode: 200,
                        body: JSON.stringify(data),
                    };
                } catch (error) {
                    console.log(error);
                    return {
                        statusCode: 500,
                        body: JSON.stringify({ error: 'Failed to execute request' }),
                    };
                }
            };
            `),
        }),
        role: lam_role_arn,
        handler: "index.handler",
        runtime: "nodejs14.x",
    });

    const integration = new aws.apigateway.Integration(`crud-dynamic-endpoints-integration-${rid}`, {
        restApi: apiID,
        resourceId: folderDBNameResource.id,
        httpMethod: method.httpMethod,
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: createDynamoDBCrudApiLambda.invokeArn,
    });

    const createDynamoDBCrudApiGatewayInvokePermission = new aws.lambda.Permission(`create-dynamodb-crud-api-gateway-invoke-permission-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createDynamoDBCrudApiLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const deployment = new aws.apigateway.Deployment(`crud-dynamic-endpoints-deployment-${rid}`, {
        restApi: apiID,
        stageName: "stage", // Uncomment this line if you want to specify a stage name.
    }, { dependsOn: [method, integration] });
    
    return { apiID, rootResourceId, dbResourceId };
};

export default handler;
