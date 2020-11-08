import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import productList from '../mocks/productList.mock.data.json';
const headers = {
    // "Access-Control-Allow-Origin": "https://d3kaeffpjwwpyk.cloudfront.net"
    "Access-Control-Allow-Origin": "*"
};

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    let response = {};
    try {

        const req_id = event.pathParameters.productId;
        const product = productList.find(({ id: db_id }) => db_id === req_id);
        response = (product ?
            {
                headers,
                statusCode: 200,
                body: JSON.stringify(product)
            }
            :
            {
                headers,
                statusCode: 404,
                body: JSON.stringify({ message: `Prouct not found: [${req_id}]` }, null, 2)
            });
    } catch (error) {
        response = {
            headers,
            statusCode: 500,
            body: JSON.stringify({ message: `SERVER_ERROR: [${error}]` }, null, 2)
        };
    } finally {
        return response;
    }
}