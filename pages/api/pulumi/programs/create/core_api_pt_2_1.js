import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as dynamodb from "@pulumi/aws/dynamodb";
import * as iam from "@pulumi/aws/iam";
import path from 'path';
import fs from 'fs';
import { RID } from "../../../../../utils/utils";

const handler = async ({ rid, ec2InstanceId, ec2InstancePublicDns }) => {

    // Create a CloudFront distribution using the instance's public DNS name
    const ec2CloudfrontDistribution = new aws.cloudfront.Distribution(
        `ec2-instance-cldfrnt-distribution-${rid}`,
        {
            origins: [
                {
                    domainName: ec2InstancePublicDns, // This uses the public DNS of the instance
                    originId: `cldfrnt-dist-ec2-id-${ec2InstanceId}`,
                    customOriginConfig: {
                        originProtocolPolicy: "http-only", // or "https-only" or "match-viewer" based on needs
                        originSslProtocols: [], // Empty array since HTTPS is not used
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
            viewerCertificate: {
                cloudfrontDefaultCertificate: true, // Use the default cloudfront certificate
            },
            // Specify no restrictions for the distribution
            restrictions: {
                geoRestriction: {
                    restrictionType: "none",
                },
            },
            isIpv6Enabled: true,
            // additional CloudFront settings
        }
    );

    return {
        ec2CloudfrontDistribution,
    };
};


export default handler;
