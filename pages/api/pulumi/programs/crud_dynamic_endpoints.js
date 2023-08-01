import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import fetch from "node-fetch"

const handler = async ({ apiID, apiName, rootResourceId, dbResourceId, lam_role_arn, executionArn, rid }) => {

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

    const createDynamoDBCrudApiLambda = new aws.lambda.Function(
        `create-dynamodb-crud-api-lambda-${rid}`,
        {
            code: new pulumi.asset.AssetArchive({
                "index.js": new pulumi.asset.StringAsset(`
                    const https = require('https');
    
                    exports.handler = async (event, context) => {
                        try {
                            const { dbname } = event.pathParameters || {}; // Extract the value of the "dbname" variable from the event
                            const postData = JSON.stringify({
                                apiID: "${apiID}",
                                apiName: "${apiName}",
                                dbResourceId: "${dbResourceId}",
                                dbName: dbname,
                                rid: "${rid}",
                                executionArn: "${executionArn}",
                            });
    
                            const options = {
                                hostname: 'crudhub.onrender.com',
                                path: '/api/deployAddCrudAPI',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Content-Length': postData.length,
                                },
                            };
    
                            return new Promise((resolve, reject) => {
                                const req = https.request(options, (res) => {
                                    let data = '';
                                    res.on('data', (chunk) => {
                                        data += chunk;
                                    });
    
                                    res.on('end', () => {
                                        console.log('Response:', data);
                                        resolve({
                                            statusCode: 200,
                                            body: JSON.stringify(data),
                                        });
                                    });
                                });
    
                                req.on('error', (error) => {
                                    console.error('Error:', error.message);
                                    reject({
                                        statusCode: 500,
                                        body: JSON.stringify({ error: 'Failed to execute request' }),
                                    });
                                });
    
                                // Send the POST request
                                req.write(postData);
                                req.end();
                            });
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
            timeout: 10, 
        }
    );
    

    // // Install node-fetch as a dependency
    // createDynamoDBCrudApiLambda.provider.on("beforeRun", async () => {
    //     await pulumi.runtime.installPackage("node-fetch", { cwd: createDynamoDBCrudApiLambda.assetPath });
    // });

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
    
    return { apiID, apiName, rootResourceId, dbResourceId, executionArn, rid };
};

export default handler;
