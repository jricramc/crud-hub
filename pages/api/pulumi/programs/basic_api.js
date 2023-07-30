import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws/apigatewayv2";
import * as lambda from "@pulumi/aws/lambda";

const handler = async () => {

    const myLambda = new aws.lambda.Function("mylambda", {
        code: new pulumi.asset.AssetArchive({
            "index.js": new pulumi.asset.StringAsset('exports.handler = async (event) => { return { body: "Hello, world!", statusCode: 200 }; };'),
        }),
        role: new aws.iam.Role("mylambda-role", {
            assumeRolePolicy: {
                Version: "2012-10-17",
                Statement: [{
                    Action: "sts:AssumeRole",
                    Principal: { Service: "lambda.amazonaws.com" },
                    Effect: "Allow",
                    Sid: "",
                }],
            },
        }).arn,
        handler: "index.handler",
        runtime: "nodejs14.x",
    });
    
    const myApi = new aws.apigatewayv2.Api("myapi", {
        protocolType: "HTTP",
    });
    
    const routeNames = ["create", "read", "update", "delete"];
    
    routeNames.forEach((route) => {
        new apigateway.Integration(`${route}-integration`, {
            apiId: myApi.id,
            integrationType: "AWS_PROXY",
            integrationUri: myLambda.arn,
            payloadFormatVersion: "2.0",
        });
    
        new apig.Route(`${route}-route`, {
            apiId: myApi.id,
            routeKey: `POST /${route}`,
            target: `integrations/${route}-integration`,
        });
    });
    
    new aws.lambda.Permission("apigw-permission", {
        action: "lambda:InvokeFunction",
        function: myLambda,
        principal: "apigateway.amazonaws.com",
        sourceArn: pulumi.interpolate`${myApi.executionArn}*/*`,
    });

    return { url: myApi.apiEndpoint };
};

export default handler;