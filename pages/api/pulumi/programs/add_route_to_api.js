import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import { RID } from "../../../../utils/utils";

const handler = async ({ apiID, rootResourceId, method, pathToResource }) => {

    const role = new aws.iam.Role("mylambda-role", {
        assumeRolePolicy: {
            Version: "2012-10-17",
            Statement: [{
                Action: "sts:AssumeRole",
                Principal: { Service: "lambda.amazonaws.com" },
                Effect: "Allow",
                Sid: "",
            }],
        },
    });

    // Create a policy that allows 'lambda:InvokeFunction' action
    const lambdaInvokePolicy = new aws.iam.Policy("lambdaInvokePolicy", {
        policy: pulumi.interpolate`{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "lambda:InvokeFunction",
                    "Resource": "*"
                }
            ]
        }`
    });

    // Attach the policy to the role
    const rolePolicyAttachment = new aws.iam.RolePolicyAttachment("rolePolicyAttachment", {
        role: role.name,
        policyArn: lambdaInvokePolicy.arn,
    });

    const myLambda = new aws.lambda.Function("mylambda", {
        code: new pulumi.asset.AssetArchive({
            "index.js": new pulumi.asset.StringAsset(`exports.handler = async (event) => { return { body: "Hello, world from ${method} ${pathToResource} for api: ${apiID}!", statusCode: 200 }; };`),
        }),
        role: role.arn,
        handler: "index.handler",
        runtime: "nodejs14.x",
    });

    const pathToResourceArray = pathToResource.split('/');

    const resourceIds = [rootResourceId]

    for (let i = 0; i < pathToResourceArray.length; i += 1) {
        const resource = new aws.apigateway.Resource(`api-resource-${pathToResourceArray[i]}-${RID()}`, {
            parentId: resourceIds[i],   // Assuming it's added directly under the deployment's root ("/")
            pathPart: pathToResourceArray[i],
            restApi: apiID,
        });

        resourceIds.push(resource.id);
    }

    const lastResourceId = resourceIds.slice(-1)[0];

    // Add a GET method to the resource
    const getMethod = new aws.apigateway.Method(`${method}-method`, {
        authorization: "NONE",
        httpMethod: method,
        resourceId: lastResourceId,
        restApi: apiID,
    });

    // Create a integration
    const lambdaIntegration = new aws.apigateway.Integration("lambdaIntegration", {
        httpMethod: getMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: lastResourceId,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: myLambda.invokeArn,
    });

    let apiId= apiID;
    let region = "us-east-2"; // like "us-east-2"
    let accountId = "442052175141"; //put your account ID

    const apiGatewayInvokePermission = new aws.lambda.Permission('apiGatewayInvokePermission', {
        action: 'lambda:InvokeFunction',
        function: myLambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`arn:aws:execute-api:${region}:${accountId}:${apiId}/*/*`
    });
    const deployment = new aws.apigateway.Deployment("apiDeployment", {
        restApi: apiID,
        stageName: "stage", // Uncomment this line if you want to specify a stage name.
    }, { dependsOn: [getMethod, lambdaIntegration] });

    // // Create an AWS API Gateway V2 Integration with the Lambda Function
    // const myIntegration = new aws.apigatewayv2.Integration("myIntegration", {
    //     apiId: apiID,
    //     integrationType: "AWS_PROXY",
    //     integrationUri: myLambda.arn,
    //     payloadFormatVersion: "2.0",
    // });


    // const additionalRoute = new aws.apigateway.Route("additionalRoute", {
    //     apiId: apiID,
    //     routeKey: `${method} ${pathToResource}`, // The route key for the route in form of METHOD /path-to-resource
    //     target: `integrations/${lambdaIntegration.id}`,
        
    // });

    return { apiID, rootResourceId, method, pathToResource, myLambda, resourceIds, getMethod, lambdaIntegration };
};

export default handler;
