import { S3Event, S3Handler, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as csv from 'csv-parser';
const { IMPORT_SERVICE_PREFIX_SOURCE, IMPORT_SERVICE_REGION, IMPORT_SERVICE_BUCKET_NAME, IMPORT_SERVICE_PREFIX_DESTINATION } = process.env;

export const importFileParser: S3Handler = async (event: S3Event, _context: Context): Promise<void> => {
    const s3 = new AWS.S3({ region: IMPORT_SERVICE_REGION });

    try {

        for (const record of event.Records) {

            const { s3: { object: { key } } } = record;
            const params = {
                Bucket: IMPORT_SERVICE_BUCKET_NAME,
                Key: key
            };
            const s3stream = s3.getObject(params).createReadStream();

            return new Promise((resolve, reject) => {
                s3stream
                    .pipe(csv())
                    .on('data', (data) => {
                        console.log('PARSED DATA:', data);
                    })
                    .on('error', (err) => {
                        // console.log(err);
                        reject(err);
                    })
                    .on('end', async () => {

                        await s3
                            .copyObject({
                                Bucket: IMPORT_SERVICE_BUCKET_NAME,
                                CopySource: `${IMPORT_SERVICE_BUCKET_NAME}/${key}`,
                                Key: key.replace(IMPORT_SERVICE_PREFIX_SOURCE, IMPORT_SERVICE_PREFIX_DESTINATION),
                            })
                            .promise();

                        await s3
                            .deleteObject(params)
                            .promise();
                        resolve();
                    });
            })
        }
    } catch (error) {
        console.error(error);
    }
};