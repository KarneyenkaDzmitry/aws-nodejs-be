import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import productList from '../mocks/productList.mock.data.json';
const headers = {
    // "Access-Control-Allow-Origin": "https://d3kaeffpjwwpyk.cloudfront.net"
    "Access-Control-Allow-Origin": "*"
};

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    try {

        const req_id = event.pathParameters.productId;
        const product = productList.find(({ id: db_id }) => db_id === req_id);
        if (product) {
            return {
                headers,
                statusCode: 200,
                body: JSON.stringify(product)
            }
        } else {
            return {
                headers,
                statusCode: 404,
                body: JSON.stringify({ message: `Product not found: [${req_id}]` }, null, 2)
            }
        }
    } catch (error) {
        return {
            headers,
            statusCode: 500,
            body: JSON.stringify({ message: `SERVER_ERROR: [${error}]` }, null, 2)
        };
    }
}