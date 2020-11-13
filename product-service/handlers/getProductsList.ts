import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as invoke from '../sql/db_client.helper';
import { headers } from '../enums/constants';

console.log(headers);
export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
    let products;
    try {
        products = await invoke.invoke('select p.id, p.description, p.price, p.title, s.count from products p left join stocks s on p.id = s.product_id');
        console.log(headers);

        return {
            headers,
            statusCode: 200,
            body: JSON.stringify(products.rows, null, 2)
        };
    } catch (error) {
        return {
            headers,
            statusCode: 500,
            body: JSON.stringify({ message: `SERVER_ERROR: [${error}]` }, null, 2)
        };
    }
}