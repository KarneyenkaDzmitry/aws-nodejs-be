import { S3Event, S3Handler, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as csv from 'csv-parser';
const { PREFIX, REGION, BUCKET, RSD_PREFIX } = require('../constants.json');

export const importFileParser: S3Handler = async (event: S3Event, _context: Context) => {
    const s3 = new AWS.S3({ region: REGION });

    try {

        for (const record of event.Records) {

            const { s3: { object: { key } } } = record;
            const params = {
                Bucket: BUCKET,
                Key: key
            };
            const s3stream = s3.getObject(params).createReadStream();

            return await new Promise((resolve, reject) => {
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
                                Bucket: BUCKET,
                                CopySource: `${BUCKET}/${key}`,
                                Key: key.replace(PREFIX, RSD_PREFIX),
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