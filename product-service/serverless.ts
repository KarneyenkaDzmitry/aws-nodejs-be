import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'aws-nodejs-be',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    profile: 'dkonevodov',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DB_NAME: '${file(./env.json):DB_NAME}',
      DB_USR: '${file(./env.json):DB_USR}',
      DB_PSSW: '${file(./env.json):DB_PSSW}',
      DB_ENDPOINT: '${file(./env.json):DB_ENDPOINT}',
      DB_PORT: '${file(./env.json):DB_PORT}'
    },
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',

      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    getProductsById: {
      handler: "handler.getProductsById",

      events: [
        {
          http: {
            method: 'get',
            path: '/products/{productId}',
            cors: true
          }
        }
      ]
    },
    addProduct: {
      handler: 'handler.addProduct',

      events: [
        {
          http: {
            method: 'post',
            path: 'admin/products',
            cors: true
          }
        }
      ]
    },
    deleteProductsById: {
      handler: 'handler.deleteProductsById',

      events: [
        {
          http: {
            method: 'delete',
            path: '/products/{productId}',
            cors: true
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
