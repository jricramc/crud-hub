import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID } from "../../../../utils/utils";
const handler = async ({ apiID, apiName, dbResourceId, dbName, rid, executionArn }) => {

    // const restApi = aws.apigateway.getRestApi({ id: apiID, name: apiName });

    const r_id = RID(6);
    const unique_db_name = `${dbName}_${r_id}`;

    const table = new dynamodb.Table(`dynamodb-table-${unique_db_name}-${rid}`, {
        attributes: [
            { name: "id", type: "S" },
        ],
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
    const lam_role = new iam.Role(`role-${unique_db_name}-${rid}`, {
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

    new iam.RolePolicy(`policy-${unique_db_name}-${rid}`, {
        role: lam_role.id,
        policy: JSON.stringify(lam_policy)
    });



    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs']


    // Define a new Lambda function
    const createFunc = new aws.lambda.Function(`create-func-lambda-${unique_db_name}-${rid}`, {
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

    
    const readFunc = new aws.lambda.Function(`read-func-lambda-${unique_db_name}-${rid}`, {
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
    
    const updateFunc = new aws.lambda.Function(`update-func-lambda-${unique_db_name}-${rid}`, {
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
    
    const deleteFunc = new aws.lambda.Function(`delete-func-lambda-${unique_db_name}-${rid}`, {
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
   

    const folderdbNameResource = new aws.apigateway.Resource(`folder-dbName-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: dbResourceId,
        pathPart: unique_db_name,
    });
    
    const folderCreateResource = new aws.apigateway.Resource(`folder-dynamodb-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "create",
    }, {
        dependsOn: [folderdbNameResource], // Make the integration dependent on the deleteMethod.
    });

    const folderReadResource = new aws.apigateway.Resource(`folder-read-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "read",   
    }, {
        dependsOn: [folderdbNameResource], // Make the integration dependent on the deleteMethod.
    });


    const folderUpdateResource = new aws.apigateway.Resource(`folder-update-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "update",
    }, {
        dependsOn: [folderdbNameResource], // Make the integration dependent on the deleteMethod.
    });


    const folderDeleteResource = new aws.apigateway.Resource(`folder-delete-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "delete",
    }, {
        dependsOn: [folderdbNameResource], // Make the integration dependent on the deleteMethod.
    });

    
    const createMethod = new aws.apigateway.Method(`create-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderCreateResource], // Make the integration dependent on the deleteMethod.
    });
     

    const readMethod = new aws.apigateway.Method(`read-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderReadResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderReadResource], // Make the integration dependent on the deleteMethod.
    });

    const updateMethod = new aws.apigateway.Method(`update-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderUpdateResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderUpdateResource], // Make the integration dependent on the deleteMethod.
    });

    const deleteMethod = new aws.apigateway.Method(`delete-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderDeleteResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderDeleteResource], // Make the integration dependent on the deleteMethod.
    });

    const createIntegration = new aws.apigateway.Integration(`create-integration-${unique_db_name}-${rid}`, {
        httpMethod: createMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderCreateResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: createFunc.invokeArn,
    }, {
        dependsOn: [createFunc, createMethod], // Make the integration dependent on the deleteMethod.
    });

    const readIntegration = new aws.apigateway.Integration(`read-integration-${unique_db_name}-${rid}`, {                            
        httpMethod: readMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderReadResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: readFunc.invokeArn,
    }, {
        dependsOn: [readFunc, readMethod], // Make the integration dependent on the deleteMethod.
    });
    
    const updateIntegration = new aws.apigateway.Integration(`update-integration-${unique_db_name}-${rid}`, {
        httpMethod: updateMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderUpdateResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: updateFunc.invokeArn,
    }, {
        dependsOn: [updateFunc, updateMethod], // Make the integration dependent on the deleteMethod.
    });

    const deleteIntegration = new aws.apigateway.Integration(`delete-integration-${unique_db_name}-${rid}`, {
        httpMethod: deleteMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderDeleteResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: deleteFunc.invokeArn,
    }, {
        dependsOn: [deleteFunc, deleteMethod], // Make the integration dependent on the deleteMethod.
    });

    const createApiGatewayInvokePermission = new aws.lambda.Permission(`create-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const readApiGatewayInvokePermission = new aws.lambda.Permission(`read-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: readFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const updateApiGatewayInvokePermission = new aws.lambda.Permission(`update-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: updateFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const deleteApiGatewayInvokePermission = new aws.lambda.Permission(`delete-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: deleteFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const deployment = new aws.apigateway.Deployment(`api-deployment-${unique_db_name}-${rid}`, {
        restApi: apiID,
        stageName: "stage", // Uncomment this line if you want to specify a stage name.
    }, {  dependsOn: [
        createIntegration,
        readIntegration,
        updateIntegration,
        deleteIntegration
    ] });
    
    return { apiID, apiName, dbResourceId, dbName, unique_db_name };
};

export default handler;
