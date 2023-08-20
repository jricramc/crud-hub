const AWS = require('aws-sdk');
const archiver = require('archiver'); // No need to install it, as it's available from the Layer
// const { parseBody } = require('/opt/nodejs/util-functions'); // Path to the util-functions module in the layer

exports.handler = async (event, context) => {
    try {

        const { TABLE_NAME, BUCKET_NAME } = process.env;
        
        const params = {
            TableName: TABLE_NAME
        };

        const dynamodb = new AWS.DynamoDB.DocumentClient();
        
        const { Items } = await dynamodb.scan(params).promise();

        const s3 = new AWS.S3();

        const zipStream = s3.createWriteStream({
            Bucket: BUCKET_NAME,
            Key: 'mintlify_docs.zip'
        });

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.pipe(zipStream);

        applyFuncOnObject(item => {
            archive.append(item.content, { name: item.name });
        })

        const result = await archive.finalize();

        return {
            statusCode: 200,
            body: JSON.stringify({
                msg: 'Zip file uploaded successfully',
                complete: true,
                data: {
                    archive: result,
                    Items,
                },
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                msg: 'Error uploading zip file',
                complete: false,
                data: error,
            }),
        };
    }
};

const applyFuncOnObject = (obj, folder = '', func) => {
    for(const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object') {
            applyFuncOnObject(value, `${folder}${key}/`, func)
        } else if (typeof value === 'string') {
            func({
                name: `${folder}${key}`,
                content: value,
            })
        }
    }
};

const mintlify_docs = {
    "mint.json": `
    {
        "$schema": "https://mintlify.com/schema.json",
        "api": {
          "baseUrl": "https://7gzkqkjgcg.execute-api.us-east-2.amazonaws.com/stage"
        },
        "name": "API Kit",
        "logo": {
          "dark": "/logo/mintlify-webhub-logo-dark.png",
          "light": "/logo/mintlify-webhub-logo.png"
        },
        "favicon": "/favicon.png",
        "colors": {
          "primary": "#3353DA",
          "light": "#5B7BEA",
          "dark": "#0D001D",
          "background": {
            "dark": "#000214"
          },
          "anchors": {
            "from": "#FF7F57",
            "to": "#3353DA"
          }
        },
        "topbarLinks": [
          {
            "name": "Support",
            "url": "mailto:hi@mintlify.com"
          }
        ],
        "topbarCtaButton": {
          "name": "Dashboard",
          "url": "https://webhubmvp.onrender.com/projects"
        },
        "tabs": [
          {
            "name": "API Reference",
            "url": "api-reference"
          },
          {
            "name": "About Webhub",
            "url": "about-webhub"
          }
        ],
        "navigation": [
          {
            "group": "Get Started",
            "pages": ["quickstart", "overview"]
          },
          {
            "group": "My API Services",
            "pages": [
              {
                "group": "Auth as a Service",
                "pages": [
                  "endpoints/auth/google"
                ]
              },
              {
                "group": "Payment as a Service",
                "pages": [
                  "endpoints/payment/stripe"
                ]
              }
            ]
          },
          {
            "group": "My API Resources",
            "pages": [
              "endpoints/db/dynamoDB",
              "endpoints/db/s3"
            ]
          },
          {
            "group": "CORE API Documentation",
            "pages": ["api-reference/overview"]
          },
          {
            "group": "Dynamic API",
            "pages": [
              {
                "group": "Create services",
                "pages": [
                  "api-reference/endpoint/google-oauth",
                  "api-reference/endpoint/stripe"
                ]
              },
              {
                "group": "Create Resources",
                "pages": [
                  "api-reference/endpoint/dynamodb",
                  "api-reference/endpoint/s3-bucket"
                ]
              }
            ]
          },
          {
            "group": "DynamoDB API",
            "pages": [
              "api-reference/endpoint/dynamodb-create",
              {
                "group": "Read & Query",
                "pages": [
                  "api-reference/endpoint/dynamodb-read",
                  "api-reference/endpoint/dynamodb-query"
                ]
              },
              "api-reference/endpoint/dynamodb-update",
              "api-reference/endpoint/dynamodb-delete"
            ]
          },
          {
            "group": "S3 API",
            "pages": [
              "api-reference/endpoint/s3-structure",
              "api-reference/endpoint/s3-create-path"
            ]
          },
          {
            "group": "Stripe API",
            "pages": [
              "api-reference/endpoint/stripe-payment"
            ]
          },
          {
            "group": "Google OAuth API",
            "pages": [
              "api-reference/endpoint/google-user-auth"
            ]
          },
          {
            "group": "Our Mission",
            "pages": [
              "about-webhub/our-mission"
            ]
          }
        ],
        "footerSocials": {
          "twitter": "https://twitter.com/mintlify",
          "github": "https://github.com/mintlify",
          "linkedin": "https://www.linkedin.com/company/mintsearch"
        }
      }
      
    `,
    "overview.mdx": `
    ---
    title: 'Overview'
    description: 'Learn how this API is setup and how to best leverage its features'
    ---
    
    ## What is a Dynamic API?
    
    Theres two parts to a Dynamic API. First you have the Core the of API which gives it the ability to make resources for itself and evolve to your growing needs. Second you have the endpoints that are created by the Core to talk to resources and services that are built to meet execute an operation. Two simple example of business operations are saving user data or signing in a user.
    
    ## How can I use this API as a non-technical user?
    
    We offer built in UI solutions to execute API commands to build out resources and services for your Dynamic API as well as test out the infrastructure that you have built. 
    
    **Step 1.** Go to our API Reference tab.
    
    <Frame>
      <img src="/images/screenshot-3.png" style={{ borderRadius: '0.5rem' }} />
    </Frame>
    
    **Step 2.** Second, read through the Overview page to get a better understanding of what this Dynamic API has to offer and how to best leverage it for your business use case.
    
    **Step 3.** Lastly, go through our Walkthrough Tutorial page to get a hands on experience with building, testing, and managing your API. 
    
    ## I'm a technical user, lets get the ball rolling!
    
    Great! So you know all about APIs. You can use your favorite API platform, in the overview below we will be using Postman to show you an example of endpoints you can create.
    
    **Step 1.** Click on our API Reference tab above then look through the [Dynamic API](/api-reference/) section (screenshot below). Here you will see that we have neatly organized the APIs functionality into easy to use endpoints based off of REST API and OpenAPI standards. 
    
    <Frame>
      <img src="/images/screenshot-4.png" style={{ borderRadius: '0.5rem' }} />
    </Frame>
    
    **Step 2.** Once you have built your first AWS resource or service you can look through the rest of the sections (DynamoDB API, S3 API, etc) to see how you can communicate with these resources and services. You'll find that each API exposes extremely useful functionality that AWS and our partnering services provide. We made sure to focus on keeping our APIs succinct and specific while not loosing the customizablity and flexbility that comes with a custom solution. But enought said, go check it out yourself.
    `,
    "quickstart.mdx": `
    ---
    title: 'Quickstart'
    description: 'Build a fully functional API in under 5 minutes'
    ---
    <Frame>
      <img src="/images/tech-infrastructure.jpg" style={{ borderRadius: '0.5rem' }} />
    </Frame>
    
    #
    
    # Getting Started with WebHUB Dynamic API
    
    Welcome to the Mintlify documentation guide. Follow the instructions below to learn how to deploy, update and supercharge your documentations with the advanced features Mintlify offers.
    
    ## 1. Do you need to handle user data?
    
    With this Dynamic API, you can manage your data with the service that best suits your needs!
    
    <AccordionGroup>
      <Accordion icon="chart-mixed" title="Manage user data with AWS DynamoDB Tables">
        During the onboarding process, we created a repository on your Github with
        your docs content. You can find this repository on our
        [dashboard](https://dashboard.mintlify.com). To clone the repository
        locally, follow these
        [instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
        in your terminal.
      </Accordion>
      <Accordion icon="images" title="Save photos, videos, and files with AWS S3 Bucket">
        Previewing helps you make sure your changes look as intended. We built a
        command line interface to render these changes locally. 1. Install the
        [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the
        documentation changes locally with this command: \`\`\` npm i -g mintlify \`\`\`
        2. Run the following command at the root of your documentation (where
        \`mint.json\` is): \`\`\` mintlify dev \`\`\`
      </Accordion>
    </AccordionGroup>
    
    ## 2. Do you need a way to make transactions?
    
    We offer built in integrations with Stripe's API to make e-commerce a frictionless experience
    
    <AccordionGroup>
      <Accordion icon="hand-holding-dollar" title="Implement e-commerce integration with Stripe API">
        During the onboarding process, we created a repository on your Github with
        your docs content. You can find this repository on our
        [dashboard](https://dashboard.mintlify.com). To clone the repository
        locally, follow these
        [instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
        in your terminal.
      </Accordion>
    </AccordionGroup>
    
    ## 3. Do you have a sign in page?
    
    No need to worry about configure your own authentication logic, use our seamless integration with Google OAuth.
    
    <AccordionGroup>
      <Accordion icon="handshake" title="Setup user authentication with Google OAuth">
        During the onboarding process, we created a repository on your Github with
        your docs content. You can find this repository on our
        [dashboard](https://dashboard.mintlify.com). To clone the repository
        locally, follow these
        [instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
        in your terminal.
      </Accordion>
    </AccordionGroup>
    
    ## All Done!
    
    Congrats! You’ve set up a Dynamic API with Webhub! Need support or want to give some feedback? You can email us at webhubhq@gmail.com.
    `,
    endpoints: {
        auth: {
            "google.mdx": `
            ---
            title: 'Google OAuth'
            description: 'View and manage your Google OAuth integrations'
            icon: 'fingerprint'
            ---

            _You currently have 0 Google OAuth integrations. Check out the API Reference tab and click on the [Create services](/api-reference/endpoint/google-oauth) under Dynamic API section to build this service (screenshot below)._

            <Frame>
            <img src="/images/screenshot-4.png" style={{ borderRadius: '0.5rem' }} />
            </Frame>
            `
        },
        db: {
            "dynamoDB.mdx": `
            ---
            title: 'DynamoDB'
            description: 'View and manage your DynamoDB API'
            icon: 'database'
            ---

            ## Name of DynamoDB Table 1
            _/db/dynamodb/\\{YOUR_UNIQUE_TABLE_1\\}_
            <AccordionGroup>
            <Accordion title="View Details">
                > Created on 07/23/2023
            </Accordion>
            </AccordionGroup>

            ## Name of DynamoDB Table 2
            _/db/dynamodb/\\{YOUR_UNIQUE_TABLE_2\\}_
            <AccordionGroup>
            <Accordion title="View Details">
                > Created on 08/17/2023

                #

                | Name              | Type              | Required          |
                | ----------------- | ----------------- | ----------------- |
                | id                | String            | True              |
                | name              | String            | False             |

                #

                <Tip>**Single Source of Truth:** auto generated parsing of DynamoDB table</Tip>
            </Accordion>
            </AccordionGroup>

            #

            Learn more by going to API Reference Tab > [DynamoDB API](/api-reference/endpoint/dynamodb-create). This page will give you specifics on API endpoints and neccessary methods and data formats.

            ## My DynamoDB API Functionality

            This DynamoDB API is built using [CRUD specifications](https://www.codecademy.com/article/what-is-crud). Below is a basic overview of the functionality of your DynamoDB API.

            <AccordionGroup>
            <Accordion title="Create data for my table">
                \`POST\` /payment/stripe/\\{YOUR_INTEGRATION_NAME\\}
                #
                This is the endpoint you hit when you want clients to make payments to your stripe account.
            </Accordion>
            <Accordion title="Read / Query data from my table">
                \`POST\` /payment/stripe/\\{YOUR_INTEGRATION_NAME\\}
                #
                This is the endpoint you hit when you want clients to make payments to your stripe account.
            </Accordion>
            <Accordion title="Update data in my table">
                \`POST\` /payment/stripe/\\{YOUR_INTEGRATION_NAME\\}
                #
                This is the endpoint you hit when you want clients to make payments to your stripe account.
            </Accordion>
            <Accordion title="Delete data from my table">
                \`POST\` /payment/stripe/\\{YOUR_INTEGRATION_NAME\\}
                #
                This is the endpoint you hit when you want clients to make payments to your stripe account.
            </Accordion>
            </AccordionGroup>
            `,
            "s3.mdx": `
            ---
            title: 'S3 Bucket'
            description: 'View and manage your S3 API'
            icon: 'bucket'
            ---

            ## Name of S3 Bucket 1
            _/db/dynamodb/\\{YOUR_UNIQUE_BUCKET_NAME_1\\}_
            <AccordionGroup>
            <Accordion title="View Details">
                > Created on 07/23/2023
            </Accordion>
            </AccordionGroup>

            ## Name of S3 Bucket 2
            _/db/dynamodb/\\{YOUR_UNIQUE_BUCKET_NAME_2\\}_
            <AccordionGroup>
            <Accordion title="View Details">
                > Created on 08/17/2023
            </Accordion>
            </AccordionGroup>

            #

            Learn more by going to API Reference Tab > [S3 API](/api-reference/endpoint/s3-structure). This page will give you specifics on API endpoints and neccessary methods and data formats.

            ## My S3 API Functionality

            Below is a basic overview of the functionality of your S3 API.

            <AccordionGroup>
            <Accordion title="Look for files and folders in your S3 Bucket">
                \`GET\` /v3/db/s3/\\{YOUR_BUCKET_NAME\\}/structure
                #
                This end point allows you to see the current file structure of your S3 Bucket. This is useful when you want to look for folders /files in your S3 Bucket or check that edits made to your S3 Bucket have been saved. 
            </Accordion>
            <Accordion title="Create files and folders inside your bucket">
                \`POST\` /v3/db/s3/\\{YOUR_BUCKET_NAME\\}/create/\\{PATH\\}
                #
                This endpoint creates a folder path for your S3 Bucket of value \\{PATH\\} and if files are uploaded through the body of the POST request, those files will be saved at that directory path. 
            </Accordion>
            </AccordionGroup>
            `,
        },
        payment: {
            "stripe.mdx": `
            ---
            title: 'Stripe'
            description: 'View and manage your Stripe integrations'
            icon: 'dollar-sign'
            ---

            ## Name of Stripe Integration 1
            _/payment/stripe/unqiue-name-1_
            <AccordionGroup>
            <Accordion title="View Details">
                > Created on 07/23/2023
                #
                \`STRIPE_SECRET_KEY=**************43fklsj\`
            </Accordion>
            </AccordionGroup>

            ## Name of Stripe Integration 2
            _/payment/stripe/unqiue-name-2_
            <AccordionGroup>
            <Accordion title="View Details">
                > Created on 07/23/2023
                #
                \`STRIPE_SECRET_KEY=**************h6f3g7j\`
            </Accordion>
            </AccordionGroup>

            #

            Learn more by going to API Reference Tab > [Stripe API](/api-reference). This page will give you specifics on API endpoints and neccessary methods and data formats.

            ## My Stripe API Functionality

            Overview of what this Stripe API can do with a succinct description of the endpoints you have access to

            <AccordionGroup>
            <Accordion title="Recieving payments with my API integration">
                \`POST\` /payment/stripe/\\{YOUR_INTEGRATION_NAME\\}
                #
                This is the endpoint you hit when you want clients to make payments to your stripe account.
            </Accordion>
            </AccordionGroup>
            `,
        },

    },
    "api-reference": {
        "overview.mdx": `
        ---
        title: "Overview"
        description: ""
        ---

        <Frame>
        <img src="/images/img-1.jpg" width="100%" style={{ borderRadius: '0.5rem' }} />
        </Frame>

        ## How to best use this _API Reference_ page

        This page holds all the information you will need to create, manage, and test the services and resources you create. The first thing you should be familiar with is our built in API platform (screenshot below).

        <Frame>
        <img src="/images/screenshot-1.png" style={{ borderRadius: '0.5rem' }} />
        </Frame>

        The our API platform makes the process of working with your API frictionless. Our custom HTTP request setup, makes it virtually impossible to make a mistake when sending HTTP request. This means that your infrastructure and services will always behave properly.

        ## The Power of the API Platform

        Interact with real requests and responses to get real results!

        <AccordionGroup>
        <Accordion icon="chart-network" title="Creating services and resources">
            Build your API by going to the Dynamic API section and clicking on either [Create Services](/api-reference/endpoint/google-oauth) or [Create Resources](/api-reference/endpoint/dynamodb). Each of these pages has an API Platform you can work with and a corresponding Request Body and Response Body documentation that you can use to easily fill out the neccesary data to get your services and resources up and running.
        </Accordion>
        <Accordion icon="microchip" title="Managing your API">
            You can see the general structure and functionality of your built out API at the [Documentation tab](/), but API Reference is where you get an in depth and interactive experience with your API. Below is an example 
            > Lets say you just upload important files for your business in an S3 bucket you created using the API Platform under S3 API > [Add files and folders](/api-reference/endpoint/s3-create-path). You can manage your S3 bucket by going to the S3 API > [Get Structure](/api-reference/endpoint/s3-structure) and use the API Platform on that page to see the current live state of your S3 bucket and insure that your files have been uploaded properly.
        </Accordion>
        <Accordion icon="gear-complex-code" title="Testing your API">
            Test your API’s functionality by simply hitting the endpoint you need. For example...
            > Let's say you've setup a Stripe API integration for your API, you can test that the API is working by going to Stripe API > [Recieve Payment](/api-reference/endpoint/stripe-payment) and make a real request using the API Platform on that page. Once the response body gets returned it will tell you everything you need to know about the state of your Stripe API integration.
        </Accordion>
        </AccordionGroup>
        `,
        endpoint: {
            "dynamodb-create.mdx": `
            ---
            title: "Create"
            api: "POST /dynamodb/{YOUR_DB_NAME}/create"
            description: "Add data to your DynamoDB"
            ---

            ### Path

            <ParamField path="YOUR_DB_NAME" type="string" required>
            The name of the DynamoDB you want to interact with.
            </ParamField>

            ### Body

            <ParamField body="id" type="string" required>
            The partition key for this element
            </ParamField>

            <ParamField body="name" type="string" required>
            What the id will map to
            </ParamField>

            ### Response

            <ResponseField name="statusCode" type="number">
            Based off of standard HTTP request guidelines
            </ResponseField>

            <ResponseField name="body" type="object">
                Information regarding your create request
            </ResponseField>

            <ResponseExample>

            \`\`\`json Success Response
            {
            "statusCode": 200,
            "body" {
            "msg": "Item added to table",
            "complete": true
            }
            }
            \`\`\`

            \`\`\`json Error Response
            {
            "statusCode": 400,
            "body" {
                err:  "error": {
                    "message": "One or more parameter values were invalid: Missing the key id in the item",
                    "code": "ValidationException",
                    "time": "2023-08-18T19:37:15.678Z",
                    "requestId": "PM8CAFJ8DP3C27ROARPRBCUPEJVV4KQNSO5AEMVJF66Q9ASUAAJG",
                    "statusCode": 400,
                    "retryable": false,
                    "retryDelay": 45.853296901029964
                },,
                compelete: false
            }
            }
            \`\`\`

            </ResponseExample>
            `,
            "dynamodb-delete.mdx": `
            ---
            title: "Delete"
            api: "DELETE /dynamodb/{YOUR_DB_NAME}/delete"
            description: "Delete an entry from your DynamoDB table"
            ---

            ### Path

            <ParamField path="YOUR_DB_NAME" type="string" required>
            The name of the DynamoDB you want to interact with.
            </ParamField>

            ### Body

            <ParamField body="id" type="string" required>
            ID of the element you want to remove from the table 
            </ParamField>

            ### Response

            <ResponseField name="statusCode" type="number">
            Based off of standard HTTP request guidelines
            </ResponseField>

            <ResponseField name="body" type="object">
            Information regarding your delete request
            </ResponseField>

            <ResponseExample>

            \`\`\`json Success Response
            {
            "statusCode": 200,
            "body" {
                
                "message": "Item deleted"

            }
            }
            \`\`\`

            \`\`\`json Error Response
            {
                "statusCode": 400,
                "body" {
                    err: {
                        "message": "The provided key element does not match the schema",
                        "code": "ValidationException",
                        "time": "2023-08-18T20:20:02.857Z",
                        "requestId": "K0I8M4RP3CAH2S9MM1PVGLG2GRVV4KQNSO5AEMVJF66Q9ASUAAJG",
                        "statusCode": 400,
                        "retryable": false,
                        "retryDelay": 37.399809106962046
                    },
                    compelete: false
                }
            }
            \`\`\`

            </ResponseExample>
            `,
            "dynamodb-query.mdx": `
            ---
            title: "Query"
            api: "POST /db/dynamodb/query"
            description: "Query DynamoDB table by specifying search parameters"
            ---
            `,
            "dynamodb-read.mdx": `
            
            `,
            "dynamodb-update": `
            
            `,
            "dynamodb.mdx": `
            
            `,
            "google-oauth.mdx": `
            
            `,
            "google-user-auth.mdx": `
            
            `,
            "s3-bucket.mdx": `
            
            `,
            "s3-create-path.mdx": `
            
            `,
            "s3-structure.mdx": `
            
            `,
            "stripe-payment.mdx": `
            
            `,
            "stripe.mdx": `
            
            `,
        }
    },
    "about-webhub": {
        "our-mission.mdx": `
        ---
        title: "Redefining Web Development"
        description: ""
        ---

        In the modern digital era, the real power is in the hands of those who can craft, iterate, and launch applications quickly. Yet, too often, developers find themselves entangled in the intricate web of backend infrastructure - setting up databases, managing servers, ensuring scalability - tasks that are essential but hardly the core of an innovative idea.

        ## Automated Backend for Everyone
        With WebHub, you no longer have to start from scratch. Our automated processes mean you can channel your energy into what you love most – developing groundbreaking applications. Dive deep into your creative process, and let us handle the complexities of backend infrastructure.

        ## Backed by the MIT Community
        <img src="/images/sandbox-innovation.png" style={{ borderRadius: '0.5rem' }} />
        Born out of MIT, WebHub is not just a tool but a revolution. We believe in a world where building the backend is as intuitive and enjoyable as crafting the front-end design. With this belief, we have been able to secure funding and support from three major MIT initaitives:
        1. **MIT-Pillar AI Collective**
        2. **Sandbox Innovation Fund Program**
        3. **Momentum Accelerator**

        With this support, WebHUB will empower every developer, irrespective of their expertise, to bring any application to life without the intricacies of backend management.
        `,
    },
};
