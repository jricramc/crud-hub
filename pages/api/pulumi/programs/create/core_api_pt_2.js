import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID } from "../../../../../utils/utils";

const handler = async ({ rid, apiID, rootResourceId }) => {
     
    
    

    /*
    ** ROOT RESOURCES
    */

    /*
        /db
    */
    const folderMainDBResource = new aws.apigateway.Resource(`folder-Main-DB-Resource-${rid}`, {
        restApi: apiID,
        parentId: rootResourceId,
        pathPart: "db",
    },
    { dependsOn: [] });
    
    /*
        /db/dynamodb
    */
    const folderMainDynamoDBResource = new aws.apigateway.Resource(`folder-Main-DynamoDB-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainDBResource.id,
        pathPart: "dynamodb",
    },
    { dependsOn: [ folderMainDBResource ] });

    /*
        /db/mongodb
    */
    const folderMainMongoDBResource = new aws.apigateway.Resource(`folder-Main-MongoDB-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainDBResource.id,
        pathPart: "mongodb",
    },
    { dependsOn: [ folderMainDBResource ] });

    /*
        /db/s3
    */
    const folderMainS3Resource = new aws.apigateway.Resource(`folder-Main-S3-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainDBResource.id,
        pathPart: "s3",
    },
    { dependsOn: [ folderMainDBResource ]});

    const folderMainLambdaResource = new aws.apigateway.Resource(`folder-Lambda-Resource-${rid}`, {
        restApi: apiID,
        parentId: rootResourceId,
        pathPart: "lambda",
    },
    { dependsOn: [] });

    /*
        /payment
    */
    const folderMainPaymentResource = new aws.apigateway.Resource(`folder-Main-Payment-Resource-${rid}`, {
        restApi: apiID,
        parentId: rootResourceId,
        pathPart: "payment",
    },
    { dependsOn: [] });

    /*
        /payment/stripe
    */
    const folderMainStripeResource = new aws.apigateway.Resource(`folder-Main-Stripe-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainPaymentResource.id,
        pathPart: "stripe",
    },
    { dependsOn: [ folderMainPaymentResource ] });

    /*
        /auth
    */
    const folderMainAuthResource = new aws.apigateway.Resource(`folder-Main-Auth-Resource-${rid}`, {
        restApi: apiID,
        parentId: rootResourceId,
        pathPart: "auth",
    },
    { dependsOn: [] });

    /*
        /auth/google
    */
    const folderMainGoogleResource = new aws.apigateway.Resource(`folder-Main-Google-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainAuthResource.id,
        pathPart: "google",
    },
    { dependsOn: [ folderMainAuthResource ] });

    /*
        /websockets
    */
    const folderMainWebsocketResource = new aws.apigateway.Resource(`folder-Main-Websocket-Resource-${rid}`, {
        restApi: apiID,
        parentId: rootResourceId,
        pathPart: "websocket",
    },
    { dependsOn: [] });

    /*
        /email
    */
    // const folderMainEmailResource = new aws.apigateway.Resource(`folder-Main-Email-Resource-${rid}`, {
    //     restApi: apiID,
    //     parentId: rootResourceId,
    //     pathPart: "email",
    // });

    // /*
    //     /email/sengrid
    // */
    // const folderMainSendGridResource = new aws.apigateway.Resource(`folder-Main-SendGrid-Resource-${rid}`, {
    //     restApi: apiID,
    //     parentId: folderMainEmailResource.id,
    //     pathPart: "sendgrid",
    // });

    return {
        lambdaResourceId: folderMainLambdaResource.id,
        dbResourceId: folderMainDynamoDBResource.id,
        mongodbResourceId: folderMainMongoDBResource.id,
        s3ResourceId: folderMainS3Resource.id,
        stripeResourceId: folderMainStripeResource.id,
        googleResourceId: folderMainGoogleResource.id,
        websocketResourceId: folderMainWebsocketResource.id,
        sendgridResourceId: null, // folderMainSendGridResource.id,
    };
};


export default handler;
