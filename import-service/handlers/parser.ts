import { S3Event, S3Handler, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as csv from 'csv-parser';
const { IMPORT_SERVICE_PREFIX_SOURCE, IMPORT_SERVICE_REGION, IMPORT_SERVICE_BUCKET_NAME, IMPORT_SERVICE_PREFIX_DESTINATION, SQS_QUEUE_URL } = process.env;

export const importFileParser: S3Handler = async (event: S3Event, _context: Context): Promise<void> => {
    AWS.config.update({ region: IMPORT_SERVICE_REGION });
    const s3 = new AWS.S3();

    // Create an SQS service object
    const sqs = new AWS.SQS();
    try {

        for (const record of event.Records) {

            const result = [];
            const { s3: { object: { key } } } = record;
            const params = {
                Bucket: IMPORT_SERVICE_BUCKET_NAME,
                Key: key
            };
            const s3stream = s3.getObject(params).createReadStream();

            return new Promise((resolve, reject) => {
                s3stream
                    .pipe(csv())
                    .on('data', async (data) => {
                        console.log('PARSED DATA:', data);
                        const parameters = {
                            // Remove DelaySeconds parameter and value for FIFO queues
                            DelaySeconds: 10,
                            MessageAttributes: {
                                Agent: {
                                    DataType: "String",
                                    StringValue: "AWS Lambda"
                                },
                                FunctionName: {
                                    DataType: "String",
                                    StringValue: "importFileParser"
                                }
                            },
                            MessageBody: JSON.stringify(data),
                            // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
                            // MessageGroupId: "Group1",  // Required for FIFO queues
                            QueueUrl: SQS_QUEUE_URL
                        };

                        console.log(`SQS:\n[%o]`,);
                        result.push(sqs.sendMessage(parameters).promise());
                    })
                    .on('error', (err) => {
                        // console.log(err);
                        reject(err);
                    })
                    .on('end', async () => {

                        await Promise.all(result);

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