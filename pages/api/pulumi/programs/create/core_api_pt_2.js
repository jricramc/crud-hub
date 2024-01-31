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
        /aws
    */
        const folderMainAWSResource = new aws.apigateway.Resource(`folder-Main-AWS-Resource-${rid}`, {
            restApi: apiID,
            parentId: rootResourceId,
            pathPart: "aws",
        },
        { dependsOn: [] });

    /*
        /aws/db
    */
    const folderMainDBResource = new aws.apigateway.Resource(`folder-Main-DB-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainAWSResource.id,
        pathPart: "db",
    },
    { dependsOn: [] });
    
    /*
        /aws/db/dynamodb
    */
    const folderMainDynamoDBResource = new aws.apigateway.Resource(`folder-Main-DynamoDB-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainDBResource.id,
        pathPart: "dynamodb",
    },
    { dependsOn: [ folderMainDBResource ] });


    /*
        /aws/db/s3
    */
    const folderMainS3Resource = new aws.apigateway.Resource(`folder-Main-S3-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainDBResource.id,
        pathPart: "s3",
    },
    { dependsOn: [ folderMainDBResource ]});


    /*
        /aws/lambda
    */
    const folderMainLambdaResource = new aws.apigateway.Resource(`folder-Lambda-Resource-${rid}`, {
        restApi: apiID,
        parentId: folderMainAWSResource.id,
        pathPart: "lambda",
    },
    { dependsOn: [] });


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

    return {
        lambdaResourceId: folderMainLambdaResource.id,
        dynamodbResourceId: folderMainDynamoDBResource.id,
        s3ResourceId: folderMainS3Resource.id,
        ec2Instance,
    };
};


export default handler;
