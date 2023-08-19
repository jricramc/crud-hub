import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID } from "../../../../../utils/utils";
const handler = async ({ apiID, apiName, dbResourceId, dbName, rid, executionArn, lam_role_arn }) => {

    // const restApi = aws.apigateway.getRestApi({ id: apiID, name: apiName });

    const r_id = RID(6);
    const unique_db_name = `${dbName}-${r_id}`;

    const table = new dynamodb.Table(`dynamodb-table-${unique_db_name}-${rid}`, {
        attributes: [
            { name: "_id", type: "S" },
        ],
        hashKey: "_id",
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

    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs', 'zip']


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



    
    const readAllFunc = new aws.lambda.Function(`read-all-func-lambda-${unique_db_name}-${rid}`, {
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

    const readByGetItemFunc = new aws.lambda.Function(
        `read-by-get-item-func-lambda-${unique_db_name}-${rid}`,
        {
            code: new pulumi.asset.AssetArchive({
                "index.js": new pulumi.asset.StringAsset(`
                    const AWS = require('aws-sdk');
                    const dynamoDB = new AWS.DynamoDB();

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
                    
                    exports.handler = async (event, context) => {
                        try {
                            const { params: params_ } = parseBody(event.body) || {};

                            const params = {
                                ...(params_ || {})
                                TableName : process.env.TABLE_NAME,
                            };

                            // const params = {
                            //     TableName: 'YourTableName', // Replace with your DynamoDB table name
                            //     Key: {
                            //         partitionKey: { S: 'yourPartitionKeyValue' }, // Replace with your partition key value
                            //         sortKey: { S: 'yourSortKeyValue' }, // Replace with your sort key value (if applicable)
                            //     },
                            //     AttributesToGet: ['attribute1', 'attribute2'], // Optional: List of attributes to retrieve
                            //     ConsistentRead: true, // Optional: Set to true for a strongly consistent read
                            //     ProjectionExpression: 'attribute1, attribute2', // Optional: Projection expression for specific attributes
                            //     ExpressionAttributeNames: { '#attrName': 'attribute1' }, // Optional: Attribute name placeholders
                            // };
                            
                    
                            const getItemResult = await dynamoDB.getItem(params).promise();
                            
                            // Process the getItemResult and do something with the data
                            
                            console.log('GetItem result:', JSON.stringify(getItemResult));
                    
                            const response = {
                                statusCode: 200,
                                body: JSON.stringify(getItemResult),
                            };
                    
                            return response;
                        } catch (error) {
                            console.error('Error:', error);
                            const response = {
                                statusCode: 500,
                                body: JSON.stringify({ err: error }),
                            };
                            return response;
                        }
                    };
                                
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs14.x",
            timeout: 120,
            environment: {
                variables: {
                    TABLE_NAME: table.name,
                },
            },
        }
    );

    const readByScanFunc = new aws.lambda.Function(
        `read-by-scan-func-lambda-${unique_db_name}-${rid}`,
        {
            code: new pulumi.asset.AssetArchive({
                "index.js": new pulumi.asset.StringAsset(`
                    const AWS = require('aws-sdk');
                    const dynamoDB = new AWS.DynamoDB();

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
                    
                    exports.handler = async (event, context) => {
                        try {
                            // Parse the request body
                            const { params: params_ } = parseBody(event.body) || {};

                            const params = {
                                ...(params_ || {})
                                TableName : process.env.TABLE_NAME,
                            };

                            // const params = {
                            //     TableName: 'YourTableName', // Replace with your DynamoDB table name
                            //     ProjectionExpression: 'attribute1, attribute2', // Optional: List of attributes to project into the scan result
                            //     FilterExpression: 'attribute3 = :value', // Optional: Filtering expression to filter the scan result
                            //     ExpressionAttributeValues: {
                            //         ':value': { S: 'someValue' }, // Replace with the value for the filter expression
                            //     },
                            //     Limit: 10, // Optional: Limit the number of items returned in the scan result
                            //     ExclusiveStartKey: {
                            //         partitionKey: { S: 'partitionKeyValue' }, // Replace with your partition key value
                            //         sortKey: { S: 'sortKeyValue' }, // Replace with your sort key value (if applicable)
                            //     }, // Optional: Use for paginated scans
                            // };
                            
                    
                            const scanResult = await dynamoDB.scan(params).promise();
                            
                            // Process the scanResult and do something with the data
                            
                            console.log('Scan result:', JSON.stringify(scanResult));
                    
                            const response = {
                                statusCode: 200,
                                body: JSON.stringify(scanResult),
                            };
                    
                            return response;
                        } catch (error) {
                            console.error('Error:', error);
                            const response = {
                                statusCode: 500,
                                body: JSON.stringify({ err: error }),
                            };
                            return response;
                        }
                    };                
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs14.x",
            timeout: 120,
            environment: {
                variables: {
                    TABLE_NAME: table.name,
                },
            },
        }
    );

    const readByQueryFunc = new aws.lambda.Function(
        `read-by-query-func-lambda-${unique_db_name}-${rid}`,
        {
            code: new pulumi.asset.AssetArchive({
                "index.js": new pulumi.asset.StringAsset(`
                    const AWS = require('aws-sdk');
                    const dynamoDB = new AWS.DynamoDB();

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
                    
                    exports.handler = async (event, context) => {
                        try {
                            // Parse the request body
                            const { params: params_ } = parseBody(event.body) || {};

                            const params = {
                                ...(params_ || {})
                                TableName : process.env.TABLE_NAME,
                            };
                            
                            // const params = {
                            //     TableName : process.env.TABLE_NAME,
                            //     KeyConditionExpression: 'partitionKey = :pkValue',
                            //     ExpressionAttributeValues: {
                            //         ':pkValue': { S: 'yourPartitionKeyValue' }, // Replace with your partition key value
                            //     },
                            // };
                    
                            const queryResult = await dynamoDB.query(params).promise();
                            
                            // Process the queryResult and do something with the data
                            
                            console.log('Query result:', JSON.stringify(queryResult));
                    
                            const response = {
                                statusCode: 200,
                                body: JSON.stringify(queryResult),
                            };
                    
                            return response;
                        } catch (error) {
                            console.error('Error:', error);
                            const response = {
                                statusCode: 500,
                                body: JSON.stringify({ err: error }),
                            };
                            return response;
                        }
                    };
                
                `),
            }),
            role: lam_role_arn,
            handler: "index.handler",
            runtime: "nodejs14.x",
            timeout: 120,
            environment: {
                variables: {
                    TABLE_NAME: table.name,
                },
            },
        }
    );


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
   

    /*
    **  RESOURCES
    */

    /*
        /dynamodb/{unique_db_name}
    */
    const folderdbNameResource = new aws.apigateway.Resource(`folder-dbName-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: dbResourceId,
        pathPart: unique_db_name,
    });
    
    /*
        /dynamodb/{unique_db_name}/create
    */
    const folderCreateResource = new aws.apigateway.Resource(`folder-dynamodb-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "create",
    }, {
        dependsOn: [folderdbNameResource], // Make the integration dependent on the deleteMethod.
    });

    /*
        /dynamodb/{unique_db_name}/read
    */
    const folderReadResource = new aws.apigateway.Resource(`folder-read-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "read",   
    }, {
        dependsOn: [folderdbNameResource], // Make the integration dependent on the deleteMethod.
    });

    /*
        /dynamodb/{unique_db_name}/update
    */
    const folderUpdateResource = new aws.apigateway.Resource(`folder-update-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "update",
    }, {
        dependsOn: [folderdbNameResource], // Make the integration dependent on the deleteMethod.
    });


    /*
        /dynamodb/{unique_db_name}/delete
    */
    const folderDeleteResource = new aws.apigateway.Resource(`folder-delete-resource-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderdbNameResource.id,
        pathPart: "delete",
    }, {
        dependsOn: [folderdbNameResource], // Make the integration dependent on the deleteMethod.
    });

    
    /*
        /dynamodb/{unique_db_name}/read/all
    */
    const folderReadResourceAll = new aws.apigateway.Resource(`folder-read-resource-all-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderReadResource.id,
        pathPart: "all",   
    }, {
        dependsOn: [folderReadResource], // Make the integration dependent on the deleteMethod.
    });


    /*
        /dynamodb/{unique_db_name}/read/by
    */
    const folderReadResourceBy = new aws.apigateway.Resource(`folder-read-resource-by-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderReadResource.id,
        pathPart: "by",   
    }, {
        dependsOn: [folderReadResource], // Make the integration dependent on the deleteMethod.
    });

    /*
        /dynamodb/{unique_db_name}/read/by/get-item
    */
    const folderReadResourceByGetItem = new aws.apigateway.Resource(`folder-read-resource-by-get-item-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderReadResourceBy.id,
        pathPart: "get-item",   
    }, {
        dependsOn: [folderReadResourceBy], // Make the integration dependent on the folderReadResourceBy.
    });

    /*
        /dynamodb/{unique_db_name}/read/by/scan
    */
    const folderReadResourceByScan = new aws.apigateway.Resource(`folder-read-resource-by-scan-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderReadResourceBy.id,
        pathPart: "scan",   
    }, {
        dependsOn: [folderReadResourceBy], // Make the integration dependent on the folderReadResourceBy.
    });

    /*
        /dynamodb/{unique_db_name}/read/by/query
    */
    const folderReadResourceByQuery = new aws.apigateway.Resource(`folder-read-resource-by-query-${unique_db_name}-${rid}`, {
        restApi: apiID,
        parentId: folderReadResourceBy.id,
        pathPart: "query",   
    }, {
        dependsOn: [folderReadResourceBy], // Make the integration dependent on the folderReadResourceBy.
    });


    /*
    **  METHOD
    */

    const createMethod = new aws.apigateway.Method(`create-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderCreateResource.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderCreateResource], // Make the integration dependent on the create.
    });
     

    const readAllMethod = new aws.apigateway.Method(`read-all-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderReadResourceAll.id,
        httpMethod: "GET",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderReadResourceAll], // Make the integration dependent on the readAll.
    });

    const readByGetItemMethod = new aws.apigateway.Method(`read-by-get-item-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderReadResourceByGetItem.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderReadResourceByGetItem], // Make the integration dependent on the folderReadResourceByGetItem.
    });

    const readByScanMethod = new aws.apigateway.Method(`read-by-scan-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderReadResourceByScan.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderReadResourceByScan], // Make the integration dependent on the folderReadResourceByScan.
    });

    const readByQueryMethod = new aws.apigateway.Method(`read-by-query-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderReadResourceByQuery.id,
        httpMethod: "POST",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderReadResourceByQuery], // Make the integration dependent on the readByQuery.
    });

    const updateMethod = new aws.apigateway.Method(`update-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderUpdateResource.id,
        httpMethod: "PUT",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderUpdateResource], // Make the integration dependent on the update.
    });

    const deleteMethod = new aws.apigateway.Method(`delete-method-${unique_db_name}-${rid}`, {
        restApi: apiID,
        resourceId: folderDeleteResource.id,
        httpMethod: "DELETE",
        authorization: "NONE",
        apiKeyRequired: false,
    }, {
        dependsOn: [folderDeleteResource], // Make the integration dependent on the delete.
    });


    /*
    **  INTEGRATION
    */

    const createIntegration = new aws.apigateway.Integration(`create-integration-${unique_db_name}-${rid}`, {
        httpMethod: createMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderCreateResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: createFunc.invokeArn,
    }, {
        dependsOn: [createFunc, createMethod], // Make the integration dependent on the create.
    });

    const readAllIntegration = new aws.apigateway.Integration(`read-all-integration-${unique_db_name}-${rid}`, {                            
        httpMethod: readAllMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderReadResourceAll.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: readAllFunc.invokeArn,
    }, {
        dependsOn: [readAllFunc, readAllMethod], // Make the integration dependent on the read.
    });
    
    const readByGetItemIntegration = new aws.apigateway.Integration(`read-by-get-item-integration-${unique_db_name}-${rid}`, {                            
        httpMethod: readByGetItemMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderReadResourceByGetItem.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: readByGetItemFunc.invokeArn,
    }, {
        dependsOn: [readByGetItemFunc, readByGetItemMethod], // Make the integration dependent on the read.
    });

    const readByScanIntegration = new aws.apigateway.Integration(`read-by-scan-integration-${unique_db_name}-${rid}`, {                            
        httpMethod: readByScanMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderReadResourceByScan.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: readByScanFunc.invokeArn,
    }, {
        dependsOn: [readByScanFunc, readByScanMethod], // Make the integration dependent on the read.
    });

    const readByQueryIntegration = new aws.apigateway.Integration(`read-by-query-integration-${unique_db_name}-${rid}`, {                            
        httpMethod: readByQueryMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderReadResourceByQuery.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: readByQueryFunc.invokeArn,
    }, {
        dependsOn: [readByQueryFunc, readByQueryMethod], // Make the integration dependent on the read.
    });

    const updateIntegration = new aws.apigateway.Integration(`update-integration-${unique_db_name}-${rid}`, {
        httpMethod: updateMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderUpdateResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: updateFunc.invokeArn,
    }, {
        dependsOn: [updateFunc, updateMethod], // Make the integration dependent on the update.
    });

    const deleteIntegration = new aws.apigateway.Integration(`delete-integration-${unique_db_name}-${rid}`, {
        httpMethod: deleteMethod.httpMethod,
        integrationHttpMethod: "POST",
        resourceId: folderDeleteResource.id,
        restApi: apiID,
        type: "AWS_PROXY",
        uri: deleteFunc.invokeArn,
    }, {
        dependsOn: [deleteFunc, deleteMethod], // Make the integration dependent on the delete.
    });


    /*
    **  LAMBDA PERMISSIONS
    */

    const createApiGatewayInvokePermission = new aws.lambda.Permission(`create-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: createFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const readAllApiGatewayInvokePermission = new aws.lambda.Permission(`read-all-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: readAllFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const readByGetItemApiGatewayInvokePermission = new aws.lambda.Permission(`read-by-get-item-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: readByGetItemFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const readByScanApiGatewayInvokePermission = new aws.lambda.Permission(`read-by-scan-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: readByScanFunc.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${executionArn}/*/*`
    });

    const readByQueryApiGatewayInvokePermission = new aws.lambda.Permission(`read-by-query-api-gateway-invoke-permission-${unique_db_name}-${rid}`, {
        action: 'lambda:InvokeFunction',
        function: readByQueryFunc.name,
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
        stageName: "v3", // Uncomment this line if you want to specify a stage name.
    }, { 
        dependsOn: [
            createIntegration,
            readAllIntegration,
            readByGetItemIntegration,
            readByScanIntegration,
            readByQueryIntegration,
            updateIntegration,
            deleteIntegration,
        ]
    });
    
    return { apiID, apiName, dbResourceId, dbName, unique_db_name };
};

export default handler;
