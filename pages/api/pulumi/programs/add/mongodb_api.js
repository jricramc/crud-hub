import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID } from "../../../../../utils/utils";

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const handler = async ({ apiID, apiKey, apiName, mongodbResourceId, dbName, rid, secretRid, executionArn, lam_role_arn }) => {

    // const restApi = aws.apigateway.getRestApi({ id: apiID, name: apiName });

    const r_id = RID(6);
    const unique_db_name = `${dbName}-${r_id}`;
    const mongodb_name = `mongodb-secretRid-${secretRid}`;

    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs', 'zip']


    // Define a new Lambda function
    const requestFunc = new aws.lambda.Function(`request-func-lambda-${unique_db_name}-${rid}`, {
        code: new pulumi.asset.FileArchive(path.join(...directoryArray, "mongodbRequestHandler.zip")),
        runtime: "nodejs14.x",
        handler: "mongodbRequestHandler.requestHandler",
        role: lam_role_arn,
        environment: {
            variables: {
                MONGODB_API_KEY: publicRuntimeConfig.NEXT_PUBLIC_MONGODB_API_KEY || 'no-api-key',
                MONGODB_NAME: mongodb_name,
                API_KEY: apiKey,
            },
        },
    });
   

    /*
    **  RESOURCES
    */

    /*
        /mongodb/{unique_db_name}
    */
    const folderMongoDBNameResource = new aws.apigateway.Resource(`folder-mongodb-dbName-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: mongodbResourceId,
        pathPart: unique_db_name,
    });


    /*
    **  METHOD
    */

    const requestMethod = new aws.apigateway.Method(`request-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderMongoDBNameResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderMongoDBNameResource], // Make the integration dependent on the create.
    });


    /*
    **  INTEGRATION
    */

    const requestIntegration = new aws.apigateway.Integration(`request-integration-${unique_db_name}-${rid}`, {
        httpMethod: requestMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderMongoDBNameResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: requestFunc.invokeArn,
    }, {
        dependsOn: [requestFunc, requestMethod], // Make the integration dependent on the create.
    });


    /*
    **  LAMBDA PERMISSIONS
    */

    const createApiGatewayInvokePermission = new aws.lambda.Permission(`request-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: requestFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    /*
    **  DEPLOYMENT
    */

    const deployment = new aws.apigateway.Deployment(`api-deployment-${unique_db_name}-${rid}`, {
        restApi: apiID,
        stageName: "v3", // Uncomment this line if you want to specify a stage name.
    }, { 
        dependsOn: [
            requestIntegration,
        ]
    });
    
    return { apiID, apiName, mongodbResourceId, dbName, unique_db_name, apiKey };
};

export default handler;
