import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { invoke } from '../sql/db_client.helper';
import { ProductSchema } from '../models/Product'
const { PRODUCT_SERVICE_REGION, TOPIC_ARN } = process.env;

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent): Promise<void> => {
    AWS.config.update({ region: PRODUCT_SERVICE_REGION });

    for (const record of event.Records) {
        const product = JSON.parse(record.body);
        try {
            await ProductSchema.validate(product);
            console.log('[%o]', product);
            // throw new Error('Mock Error');
            const { title, price = 0, description = '', count = 0 } = product;
            const { rows: [{ id }] } = await invoke('INSERT INTO products (title, price, description) VALUES ($1, $2, $3) RETURNING id',
                [title, price, description]
            );
            await invoke('INSERT INTO stocks (product_id, count) VALUES ($1, $2)',
                [id, count]
            );
            const message = `The following item has been added to DB:\nID: [${id}]\nTitle: [${title}]\nDescription: [${description}]\nPrice: [${price}]\nCount: [${count}]`;
            // Create publish parameters
            console.log(message);

            const params = {
                Message: message, /* required */
                MessageAttributes: {
                    status: {
                        DataType: "String",
                        StringValue: 'succeed'
                    }
                },
                Subject: `New [${title}] item has been added!`,
                TopicArn: TOPIC_ARN
            };
            // Create promise and SNS service object
            await new AWS.SNS().publish(params).promise();
        } catch (error) {
            const message = `The following item has NOT been added to DB:\nProduct From CSV: [${product}]`;
            // Create publish parameters
            console.error(message);

            const params = {
                Message: message, /* required */
                MessageAttributes: {
                    status: {
                        DataType: "String",
                        StringValue: "failed"
                    }
                },
                Subject: `ERROR: Product item has NOT been added!`,
                TopicArn: TOPIC_ARN
            };
            // Create promise and SNS service object
            await new AWS.SNS().publish(params).promise();
        }
    }
};
