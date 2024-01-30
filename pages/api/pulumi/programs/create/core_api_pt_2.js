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
     
    
    const directoryArray = [process.cwd(), 'pages', 'api', 'pulumi', 'programs', 'sh']

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

    // We can lookup the existing launch template using `aws.ec2.getLaunchTemplate`
    const launchTemplate = aws.ec2.getLaunchTemplate({
        name: "EC2-Amazon-Linux-Base-Launch-Template-v1",
    });
    
    // Create an EC2 instance
    const ec2InstanceName = `ec2-instance-${rid}`;
    const ec2Instance = new aws.ec2.Instance(ec2InstanceName, {
        instanceType: "t2.micro",
        keyName: "ec2-instance-key-pair",
        // ami: aws.ec2.AmazonLinux2Image.id, // Use the latest Amazon Linux 2 AMI
        ami: "ami-0cd3c7f72edd5b06d",
        // vpcSecurityGroupIds: [securityGroup.id],
        //userData,
        // userData: fs.readFileSync(path.join(...directoryArray, "ec2-setup-script.sh"), "utf-8")
        //     + ` -a ${appName}`
        //     + ` -r ${repoURL}`
        //     // + ` -p ${port}`
        //     ,
        tags: {
            Name: ec2InstanceName, // Set the name using the "Name" tag
            // Add other tags if needed...
        },
        launchTemplate: {
            id: launchTemplate.then(lt => lt.id), // Use the launch template ID
            version: launchTemplate.then(lt => lt.defaultVersion.toString()), // Optionally, specify the version of the launch template
        },
    });

    // Create a CloudFront distribution using the instance's public DNS name
    const ec2CloudfrontDistribution = new aws.cloudfront.Distribution(`ec2-instance-cldfrnt-distribution-${rid}`, {
        origins: [
            {
                domainName: pulumi.interpolate`${ec2Instance.publicDns}`, // This uses the public DNS of the instance
                originId: pulumi.interpolate`cldfrnt-dist-ec2-id-${ec2Instance.id}`,
                customOriginConfig: {
                    originProtocolPolicy: "http-only", // or "https-only" or "match-viewer" based on needs
                    httpPort: 80, // the HTTP port your instance listens on, adjust as necessary
                    httpsPort: 443, // the HTTPS port your instance listens on, adjust as necessary
                },
            },
        ],
        enabled: true,
        defaultCacheBehavior: {
            targetOriginId: "ec2InstanceOrigin",
            viewerProtocolPolicy: "redirect-to-https", // Force HTTPS
            allowedMethods: ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
            cachedMethods: ["GET", "HEAD"],
            // other cache behavior settings
        },
        // Specify no restrictions for the distribution
        restrictions: {
            geoRestriction: {
                restrictionType: "none",
            },
        },
        isIpv6Enabled: true,
        // additional CloudFront settings
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
        ec2CloudfrontDistribution,
    };
};


export default handler;
