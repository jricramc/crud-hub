// import * as pulumi from "@pulumi/pulumi";
// import * as aws from "@pulumi/aws";

// // Upload the layer to S3
// const layerBucket = new aws.s3.Bucket("lambda-layer-bucket");

// const layerObject = new aws.s3.BucketObject("layerObject", {
//     bucket: layerBucket.id,
//     source: new pulumi.asset.FileAsset("path/to/your/layer.zip"), // replace with your actual path
// });

// // Create a Lambda layer from the uploaded ZIP
// const lambdaLayer = new aws.lambda.LayerVersion("stripeLayer", {
//     sourceCodeHash: layerObject.etag,
//     fileName: pulumi.interpolate`${layerBucket.bucketRegionalDomainName}/${layerObject.key}`,
//     compatibleRuntimes: ["nodejs14.x"], // adjust the runtime as necessary
// });

// // Export the ARN of the layer for reference
// export const layerArn = lambdaLayer.arn;


import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// First, you need to create an S3 bucket that will store your Lambda Layer.
let bucket = new aws.s3.Bucket("stripe-layer-bucket");

// Next, you create the object in that S3 bucket
let object = new aws.s3.BucketObject("stripe-layer-object", {
    bucket: bucket.id,
    // the source of the object, this should be a ZIP file
    // that contains your Node.js package/dependencies including stripe
    source: new pulumi.asset.FileAsset("stripe-layer1.zip") // path to lambda layer package
});

// Then, create your Lambda Layer and refer to the object in S3
let layer = new aws.lambda.LayerVersion("stripe-lambda-layer", {
    compatibleRuntimes: ['nodejs18.x'], // compatible runtime with stripe
    code: {
        bucket: bucket.bucket,
        key: object.key
    },
    layerName: "stripe-layer",
    description: "A layer for stripe integration",
});

// Export values to access when this stack is used in another stack
export const layerOutput = layer;