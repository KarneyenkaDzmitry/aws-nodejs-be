import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
const { IMPORT_SERVICE_PREFIX_SOURCE, IMPORT_SERVICE_REGION, IMPORT_SERVICE_BUCKET_NAME } = process.env;

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {

    const s3 = new AWS.S3({ region: IMPORT_SERVICE_REGION });

    const { name } = event.queryStringParameters;
    try {
        if (!name.endsWith('csv')) throw Error('File extension does not fit requirements. It should be an [CSV] file');
        console.debug("FILENAME: [%s]", name);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "text/csv"
            },
            // body: JSON.stringify(`https://${IMPORT_SERVICE_BUCKET_NAME}.s3-${IMPORT_SERVICE_REGION}.amazonaws.com/${IMPORT_SERVICE_PREFIX_SOURCE}/${name}`),
            body: await s3.getSignedUrlPromise("putObject", { Bucket: IMPORT_SERVICE_BUCKET_NAME, Key: `${IMPORT_SERVICE_PREFIX_SOURCE}/${name}`, Expires: 60, ContentType: "text/csv" })
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 406,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'text/csv'
            },
            body: error.message
        };
    }
};


