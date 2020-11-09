import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as invoke from '../sql/db_client.helper';
const headers = {
    // "Access-Control-Allow-Origin": "https://d3kaeffpjwwpyk.cloudfront.net"
    "Access-Control-Allow-Origin": "*"
    // 'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
}

export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
    let products;
    try {
        products = await invoke.invoke('select p.id, p.description, p.price, p.title, s.count from products p left join stocks s on p.id = s.product_id');
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