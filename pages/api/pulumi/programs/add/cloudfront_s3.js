import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID, extractRegionAndAccountIdFromExecutionArn } from "../../../../../utils/utils";
const handler = async ({ name, rid, executionArn }) => {

    const { region, accountId } = extractRegionAndAccountIdFromExecutionArn(executionArn);

    const r_id = RID(6);
    const unique_cloudfrontS3_name = `${name}-${r_id}`.toLocaleLowerCase();

    const bucketName = unique_cloudfrontS3_name;
    const cloudfrontName = `cloudfront-${unique_cloudfrontS3_name}`;
    const iamUserName = `IAM-user-${rid}-${unique_cloudfrontS3_name}`;

    // Create an S3 bucket
    const s3Bucket = new aws.s3.Bucket(bucketName, {
        acl: "private", // Adjust permissions as needed
    });

    // Create a CloudFront distribution
    const cloudfrontDistribution = new aws.cloudfront.Distribution(cloudfrontName, {
        enabled: true,
        origins: [
            {
                domainName: s3Bucket.websiteEndpoint,
                originId: s3Bucket.bucketDomainName,
                s3OriginConfig: {
                    // originAccessIdentity: "origin-access-identity/cloudfront/your-origin-access-identity", // Update with your CloudFront OAI
                },
            },
        ],
        defaultRootObject: "index.html",
        defaultCacheBehavior: {
            targetOriginId: s3Bucket.bucketDomainName,
            viewerProtocolPolicy: "redirect-to-https",
            allowedMethods: ["GET", "HEAD", "OPTIONS"],
            cachedMethods: ["GET", "HEAD"],
            forwardedValues: {
                cookies: { forward: "none" },
                queryString: false,
            },
            minTtl: 0,
            defaultTtl: 3600,
            maxTtl: 86400,
        },
        // priceClass: "PriceClass_100",
        restrictions: {
            geoRestriction: {
                restrictionType: "none", // or "whitelist" or "blacklist"
                locations: [], // Add your desired locations if using whitelist or blacklist
            },
        },
    });

    // Set the bucket policy
    const s3BucketPolicy = new aws.s3.BucketPolicy(`${bucketName}-policy`, {
        bucket: s3Bucket.bucket,
        policy: {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "Statement1",
                    Effect: "Allow",
                    Principal: {
                        AWS: cloudfrontDistribution.arn,
                    },
                    Action: "s3:GetObject",
                    Resource: pulumi.interpolate`${s3Bucket.arn}/*`,
                },
            ],
        },
    });

    // Create an IAM user
    const iamUser = new aws.iam.User(iamUserName);

// Create an inline policy with the combined permissions
const combinedPolicy = pulumi.all([cloudfrontDistribution.id]).apply(([cloudfrontDistribution_id]) => JSON.stringify({
    Version: "2012-10-17",
    Statement: [
        {
            Sid: "PublicReadGetObject",
            Effect: "Allow",
            Action: [
                "s3:GetObject",
                "s3:ListBucket",
                "s3:PutObject",
            ],
            Resource: [
                `arn:aws:s3:::${bucketName}`,
                `arn:aws:s3:::${bucketName}/*`,
            ],
        },
        {
            Effect: "Allow",
            Action: "cloudfront:CreateInvalidation",
            Resource: `arn:aws:cloudfront::${accountId}:distribution/${cloudfrontDistribution_id}`,
        },
    ],
}));

    // Attach the inline policy to the IAM user
    const userPolicyAttachment = new aws.iam.UserPolicyAttachment(`user-policy-attachment-${rid}-${unique_cloudfrontS3_name}`, {
        policyArn: pulumi.interpolate`arn:aws:iam::${accountId}:policy/${iamUser.name}`,
        user: iamUser.name,
        policy: combinedPolicy,
    });

    // Export IAM user access keys
    const iamUserAccessKeys = pulumi.all([iamUser.name, iamUser.id]).apply(([userName, userId]) => {
        const accessKeys = new aws.iam.AccessKey(`${userName}-key`, {
            user: userName,
        });

        return {
            aws_access_key_id: accessKeys.id,
            aws_secret_access_key: accessKeys.secret,
        };
    });
    
    return { unique_cloudfrontS3_name, iamUser, iamUserAccessKeys, cloudfrontDistribution, s3Bucket };
};

export default handler;
