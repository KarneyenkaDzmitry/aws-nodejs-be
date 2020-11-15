// const AWS = require('aws-sdk');
const BUCKET = "aws-nodejs-import-service";
const REGION = 'eu-west-1';
const PREFIX = "uploaded";

module.exports.importProductsFile = async event => {
  // const s3 = new AWS.S3({ region: REGION });
  // const params = {
  //   Bucket: BUCKET,
  //   Prefix: PREFIX
  // };
  const { name } = event.queryStringParameters;
  try {
    if (!name.endsWith('csv')) throw Error('File extension does not fit requirements. It should be an [CSV] file');
    // const s3Response = await s3.listObjectsV2(params).promise();
    // console.log(s3Response);
    console.debug("FILENAME: [%s]", name);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(`https://${BUCKET}.s3-eu-west-1.amazonaws.com/${PREFIX}/${name}`, null, 2),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 406,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: 'text/csv'
      },
      body: JSON.stringify(error, null, 2),
    };
  }
};
