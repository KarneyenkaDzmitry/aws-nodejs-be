import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import  productList from '../mocks/productList.mock.data.json';
const headers =  {
    // "Access-Control-Allow-Origin": "https://d3kaeffpjwwpyk.cloudfront.net"
    "Access-Control-Allow-Origin": "*"
}

export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
    try {
        return {
            headers,
            statusCode: 200,
            body: JSON.stringify( productList, null, 2)
        };

    } catch (error) {
        return {
            headers,
            statusCode: 500,
            body: JSON.stringify({ message: `SERVER_ERROR: [${error}]` }, null, 2)
        };
    }
}