import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
const handler = async ({ apiID, dbResourceId, dbName}) => {

    const table = new dynamodb.Table("test0table", {
        attributes: [{
            name: "id",
            type: "S"
        }],
        hashKey: "id",
        billingMode: "PAY_PER_REQUEST",
    });

    // Define a policy to access DynamoDB
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
            ],
            Resource: "*",
        }],
    };
    
    // Create a role and attach our new policy
    const lam_role = new iam.Role("myRole", {
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

    new iam.RolePolicy("myRolePolicy", {
        role: lam_role.id,
        policy: JSON.stringify(lam_policy)
    });



    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs']


    // Define a new Lambda function
    const createFunc = new aws.lambda.Function("createFunction", {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "handler.zip")),
        runtime: "nodejs14.x",
        handler: "handler.createHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    });

    
    const readFunc = new aws.lambda.Function("readFunction", {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "read.zip")),
        runtime: "nodejs14.x",
        handler: "read.readHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    });
    
    const updateFunc = new aws.lambda.Function("updateFunction", {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "update.zip")),
        runtime: "nodejs14.x",
        handler: "update.updateHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    });
    
    const deleteFunc = new aws.lambda.Function("deleteFunction", {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "delete.zip")),
        runtime: "nodejs14.x",
        handler: "delete.deleteHandler",
        role: lam_role.arn,
        environment: {
            variables: {
                TABLE_NAME: table.name,
            },
        },
    });
   

    const folderdbNameResource = new aws.apigateway.Resource("folder-dbName-resource", {
        restApi: apiID,
        parentId: dbResourceId,
        pathPart: dbName,
    });
    
    const folderCreateResource = new aws.apigateway.Resource("folder-dynamodb-resource", {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "create",
    });

    const folderReadResource = new aws.apigateway.Resource("folder-read-resource", {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "read",   
    });


    const folderUpdateResource = new aws.apigateway.Resource("folder-update-resource", {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "update",
    });


    const folderDeleteResource = new aws.apigateway.Resource("folder-delete-resource", {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "delete",
    });

    
    const createMethod = new aws.apigateway.Method("create-method", {
        restApi: apiID,
        resourceId: folderCreateResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    });
     

    const readMethod = new aws.apigateway.Method("read-method", {
        restApi: apiID,
        resourceId: folderReadResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    const updateMethod = new aws.apigateway.Method("update-method", {
        restApi: apiID,
        resourceId: folderUpdateResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    const deleteMethod = new aws.apigateway.Method("delete-method", {
        restApi: apiID,
        resourceId: folderDeleteResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    });

    const createIntegration = new aws.apigateway.Integration("create-integration", {
        httpMethod: createMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderCreateResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: createFunc.invokeArn,
    });

    const readIntegration = new aws.apigateway.Integration("read-integration", {                            
        httpMethod: readMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderReadResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: readFunc.invokeArn,
    });
    
    const updateIntegration = new aws.apigateway.Integration("update-integration", {
        httpMethod: updateMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderUpdateResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: updateFunc.invokeArn,
    });

    const deleteIntegration = new aws.apigateway.Integration("delete-integration", {
        httpMethod: deleteMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderDeleteResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: deleteFunc.invokeArn,
    });
    

    let apiId= apiID;
    let region = "us-east-2"; // like "us-east-2"
    let accountId = "442052175141"; //put your account ID

    const createApiGatewayInvokePermission = new aws.lambda.Permission('createApiGatewayInvokePermission', {
        action: 'lambda:InvokeFunction',
        function: createFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`arn:aws:execute-api:${region}:${accountId}:${apiId}/*/*`
    });

    const readApiGatewayInvokePermission = new aws.lambda.Permission('readApiGatewayInvokePermission', {
        action: 'lambda:InvokeFunction',
        function: readFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`arn:aws:execute-api:${region}:${accountId}:${apiId}/*/*`
    });

    const updateApiGatewayInvokePermission = new aws.lambda.Permission('updateApiGatewayInvokePermission', {
        action: 'lambda:InvokeFunction',
        function: updateFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`arn:aws:execute-api:${region}:${accountId}:${apiId}/*/*`
    });

    const deleteApiGatewayInvokePermission = new aws.lambda.Permission('deleteApiGatewayInvokePermission', {
        action: 'lambda:InvokeFunction',
        function: deleteFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`arn:aws:execute-api:${region}:${accountId}:${apiId}/*/*`
    });

    const deployment = new aws.apigateway.Deployment("apiDeployment", {
        restApi: apiID,
        stageName: "stage", // Uncomment this line if you want to specify a stage name.
    }, {  dependsOn: [
        createMethod, createIntegration,
        readMethod, readIntegration,
        updateMethod,updateIntegration,
        deleteMethod, deleteIntegration
    ] });
    
    return { apiID, dbResourceId, dbName};
};

export default handler;
