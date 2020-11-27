import { APIGatewayTokenAuthorizerHandler, APIGatewayTokenAuthorizerEvent, Context, APIGatewayAuthorizerResult } from 'aws-lambda';
import { generatePolicy } from './authorization.helper';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent, _context: Context): Promise<APIGatewayAuthorizerResult> => {
    // console.log('CONTEXT: [%o]', _context)
    console.log('EVENT: [%o]', event)

    return new Promise((resolve, reject) => {

        if (event.type != 'TOKEN') reject('Unauthorized');

        const { authorizationToken } = event;
        const encodedCreds = authorizationToken.split(/\s/)[1];

        try {
            const [username, password] = Buffer.from(encodedCreds, 'base64').toString('utf-8').split(/:/);
            console.log(`USERNAME: [${username}], PASSWORD: [${password}]`);

            const effect = !!process.env[username] && process.env[username] === password ? 'Allow' : 'Deny';
            console.log('EFFECT: [%s]', effect);

            const policy = generatePolicy(encodedCreds, event.methodArn, effect);
            console.log("POLICY: [%o]", policy);

            resolve(policy);
        } catch (error) {
            console.error(error)
            reject(`Unauthorized: ${error.message}`);
        }
    })
}