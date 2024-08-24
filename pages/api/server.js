import AWS from 'aws-sdk';

const handler = async (req, res) => {
    try {
      const { method, body: { arn } } = req;

      console.log('arrn: ', arn);

      if (method === 'POST') {
        // Assume the role
        const sts = new AWS.STS();
        const assumeRoleResponse = await sts
          .assumeRole({
            RoleArn: arn,
            RoleSessionName: 'webhub',
          })
          .promise();
    
        const assumedRoleUser = assumeRoleResponse.AssumedRoleUser;

        console.log('Assumed Role User:', assumedRoleUser);
  
        res.status(200).json('Role assumed successfully');
      } else res.status(405).end(`Method ${method} Not Allowed`);
    } catch (error) {
      console.error('Error assuming role:', error);
      res.status(500).json(error);
    }
  };
  
    
        // Extract the credentials from the assume role response
        // const {
        //   AccessKeyId,
        //   SecretAccessKey,
        //   SessionToken,
        // } = assumeRoleResponse.Credentials;
        // sts.assumeRole(params, (err, data) => {
        //     if (err) {
        //       console.error('Error assuming role:', err.message);
        //       res.send(`Error assuming role: ${err.message}`);
        //     } else {
        //       console.log('Role assumed:', data);
        //       res.send('Role assumed successfully');
        //       // Perform actions using the assumed credentials
        //     }
        //   });
    
        // Configure DynamoDB client with the assumed role credentials and region
    //     const dynamoDB = new AWS.DynamoDB({
    //       accessKeyId: AccessKeyId,
    //       secretAccessKey: SecretAccessKey,
    //       sessionToken: SessionToken,
    //       region: 'us-east-2', // Replace with your desired region
    //     });
    
    //     // Create DynamoDB table
    //     const tableName = 'Trial3'; // Replace with your table name
    //     const createTableResponse = await dynamoDB
    //       .createTable({
    //         TableName: tableName,
    //         AttributeDefinitions: [
    //           {
    //             AttributeName: 'Id',
    //             AttributeType: 'N',
    //           },
    //         ],
    //         KeySchema: [
    //           {
    //             AttributeName: 'Id',
    //             KeyType: 'HASH',
    //           },
    //         ],
    //         ProvisionedThroughput: {
    //           ReadCapacityUnits: 5,
    //           WriteCapacityUnits: 5,
    //         },
    //       })
    //       .promise();
    //     // console.log(createTableResponse)
      

export default handler;



    
