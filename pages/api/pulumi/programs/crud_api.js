import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID } from "../../../../utils/utils";

const handler = async () => {

    const rid = RID();

    const table = new dynamodb.Table(`ledger-table-${rid}`, {
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
    const lam_role = new iam.Role(`lam-role-${rid}`, {
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

    new iam.RolePolicy(`role-policy-${rid}`, {
        role: lam_role.id,
        policy: JSON.stringify(lam_policy)
    });



    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs']


    // Define a new Lambda function
    const createFunc = new aws.lambda.Function(`ledger-create-function-${rid}`, {
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

    
    const readFunc = new aws.lambda.Function(`ledger-read-function-${rid}`, {
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
    
    const updateFunc = new aws.lambda.Function(`ledger-update-function-${rid}`, {
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
    
    const deleteFunc = new aws.lambda.Function(`ledger-delete-function-${rid}`, {
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


    // Create a new Rest API Gateway using awsx.
    const api = new apigateway.RestAPI(`ledger-crud-api-${rid}`, {
        routes: [
            { path: "/ledger/create", method: "POST", eventHandler: createFunc },
            { path: "/ledger/read", method: "POST", eventHandler: readFunc },
            { path: "/ledger/update", method: "POST", eventHandler: updateFunc },
            { path: "/ledger/delete", method: "POST", eventHandler: deleteFunc },
        ],
    });

    const { api: { id: restApiId, name: apiName, rootResourceId, executionArn } } = api;

    const folderMainDynamoDBResource = new aws.apigateway.Resource(`folder-Main-DynamoDB-Resource-${rid}`, {
        restApi: restApiId,
        parentId: rootResourceId,
        pathPart: "dynamodb",
    });
    
    return {
        url: api.url,
        api,
        apiID: restApiId,
        apiName,
        rootResourceId,
        dbResourceId: folderMainDynamoDBResource.id,
        lam_role,
        executionArn,
        rid,
    };
};

export default handler;
