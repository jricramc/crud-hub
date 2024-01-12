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


    /*
        Create EC2 Instance
    */

    const securityGroup = new aws.ec2.SecurityGroup(`security-group-${rid}`, {
        ingress: [
            {
                protocol: "-1",
                fromPort: 0,
                toPort: 0,
                cidrBlocks: ["0.0.0.0/0"],
            },
        ],
    });

    const appName = "GraphQL-PE-CORE-API";
    const repoURL = "https://github.com/webhubhq/GraphQL-PE-CORE-API.git";
    
    // Create an EC2 instance
    const ec2Instance = new aws.ec2.Instance("my-instance", {
        instanceType: "t2.micro",
        ami: "ami-0c55b159cbfafe1f0",  // Amazon Linux 2 AMI ID
        vpcSecurityGroupIds: [securityGroup.id],
        userData: fs.readFileSync("./ec2-setup-script.sh", "utf-8")
            + ` -a ${appName}`
            + ` -r ${repoURL}`
            // + ` -p ${port}`,
    });

    return {
        lambdaResourceId: folderMainLambdaResource.id,
        dbResourceId: folderMainDynamoDBResource.id,
        mongodbResourceId: folderMainMongoDBResource.id,
        s3ResourceId: folderMainS3Resource.id,
        stripeResourceId: folderMainStripeResource.id,
        googleResourceId: folderMainGoogleResource.id,
        websocketResourceId: folderMainWebsocketResource.id,
        sendgridResourceId: null, // folderMainSendGridResource.id,
        ec2Instance,
    };
};


export default handler;
