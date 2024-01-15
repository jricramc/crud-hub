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

    const APP_NAME = "GraphQL-PE-CORE-API";
    const REPO_URL = "https://github.com/webhubhq/GraphQL-PE-CORE-API.git";

    const userData = `#!/bin/bash

    exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
    yum -y update
    echo "Finish basic update and system log config"

    # Default values
    APP_NAME="${APP_NAME}"
    REPO_URL="${REPO_URL}"
    # PORT=3000

    # Echo variable names
    echo "APP_NAME: \${APP_NAME}"
    echo "REPO_URL: \${REPO_URL}"

    # Install Node.js 14.x (you can change the version if needed)
    curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
    sudo yum install -y nodejs

    # Confirm Node.js and npm installation
    node --version
    npm --version

    
    # Install Git
    sudo yum install -y git

    # Install PM2 globally
    sudo npm install -g pm2

    # Install NGINX
    sudo yum install -y nginx

    # Start NGINX
    sudo systemctl start nginx

    # Enable NGINX to start on boot
    sudo systemctl enable nginx
    
    # Create a directory for your app
    sudo mkdir -p "/var/www/\${APP_NAME}"
    # sudo chown -R ec2-user:ec2-user "/var/www/\${APP_NAME}"
    
    # Navigate to the app directory
    cd "/var/www/\${APP_NAME}"
    
    # Clone your app repository
    git clone "\${REPO_URL}" .
    
    # Install app dependencies
    npm install
    
    # start the Apollo Server built in repo
    npm run start
    
    # Add other commands using the variables, e.g., $PORT
    
    `
    
    // Create an EC2 instance
    const ec2InstanceName = `ec2-instance-${rid}`;
    const ec2Instance = new aws.ec2.Instance(ec2InstanceName, {
        instanceType: "t2.micro",
        keyName: "ec2-instance-key-pair",
        // ami: aws.ec2.AmazonLinux2Image.id, // Use the latest Amazon Linux 2 AMI
        ami: "ami-0cd3c7f72edd5b06d",
        vpcSecurityGroupIds: [securityGroup.id],
        userData,
        // userData: fs.readFileSync(path.join(...directoryArray, "ec2-setup-script.sh"), "utf-8")
        //     + ` -a ${appName}`
        //     + ` -r ${repoURL}`
        //     // + ` -p ${port}`
        //     ,
        tags: {
            Name: ec2InstanceName, // Set the name using the "Name" tag
            // Add other tags if needed...
        },
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
        awsEC2: aws.ec2,
    };
};


export default handler;
