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
        acl: "private", // Allow public read access
        website: {
            indexDocument: "index.html", // Set the index document
            errorDocument: "error.html", // Set the error document (optional)
        },
    });

    // Create a CloudFront distribution
    const cloudfrontDistribution = new aws.cloudfront.Distribution(cloudfrontName, {
        enabled: true,
        defaultRootObject: "index.html",
        origins: [
            {
                originId: s3Bucket.arn,
                domainName: s3Bucket.websiteEndpoint,
                customOriginConfig: {
                    originProtocolPolicy: "http-only",
                    httpPort: 80,
                    httpsPort: 443,
                    originSslProtocols: ["TLSv1", "TLSv1.1", "TLSv1.2"],
                },
            },
        ],
        defaultCacheBehavior: {
            targetOriginId: s3Bucket.arn,
            viewerProtocolPolicy: "redirect-to-https",
            allowedMethods: ["GET", "HEAD", "OPTIONS"],
            cachedMethods: ["GET", "HEAD", "OPTIONS"],
            forwardedValues: {
                cookies: { forward: "none" },
                queryString: false,
            },
            minTTL: 0,
            defaultTTL: 60 * 60 * 24,   // Cache for 1 day
            maxTTL: 60 * 60 * 24 * 7,   // Cache for 1 week
        },
        // priceClass: "PriceClass_100",
        restrictions: {
            geoRestriction: {
                restrictionType: "none", // or "whitelist" or "blacklist"
                locations: [], // Add your desired locations if using whitelist or blacklist
            },
        },
        tags: {
            Environment: "production",
        },
        viewerCertificate: {
            cloudfrontDefaultCertificate: true,
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

    // Create an IAM policy with the combined permissions
    const combinedPolicy = new aws.iam.Policy("combined-policy", {
        name: pulumi.interpolate`combined-policy-${rid}-${unique_cloudfrontS3_name}`,
        path: "/",
        description: "Combined IAM policy for S3 and CloudFront",
        policy: pulumi.all([cloudfrontDistribution.id]).apply(([cloudfrontDistribution_id]) => JSON.stringify({
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
        })),
    });

    // Attach the IAM policy to the IAM user
    const userPolicyAttachment = new aws.iam.UserPolicyAttachment(`user-policy-attachment-${rid}-${unique_cloudfrontS3_name}`, {
        user: iamUser.name,
        policyArn: combinedPolicy.arn,
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
