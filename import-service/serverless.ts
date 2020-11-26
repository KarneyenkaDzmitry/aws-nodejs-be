import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'aws-nodejs-import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    s3: {
      region: 'eu-west-1',
      bucket: 'aws-nodejs-import-service',
      uploaded: 'uploaded',
      parsed: 'parsed',
    },
    sqs: {
      arn: "${cf:aws-nodejs-be-${self:provider.stage}.QueueARN}",
      url: "${cf:aws-nodejs-be-${self:provider.stage}.QueueURL}"
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
      IMPORT_SERVICE_BUCKET_NAME: '${self:custom.s3.bucket}',
      IMPORT_SERVICE_REGION: '${self:custom.s3.region}',
      IMPORT_SERVICE_PREFIX_SOURCE: '${self:custom.s3.uploaded}',
      IMPORT_SERVICE_PREFIX_DESTINATION: '${self:custom.s3.parsed}',
      SQS_QUEUE_URL: '${self:custom.sqs.url}'
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:ListBucket"],
        Resource: "arn:aws:s3:::${self:custom.s3.bucket}"
      },
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: "arn:aws:s3:::${self:custom.s3.bucket}/*"
      },
      {
        Effect: 'Allow',
        Action: ["sqs:*"],
        Resource: "${self:custom.sqs.arn}"
      }
    ]
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: {
              origins: ["*"],
              headers: ["*"]
            },
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: "handler.importFileParser",
      events: [
        {
          s3: {
            bucket: '${self:custom.s3.bucket}',
            event: "s3:ObjectCreated:*",
            rules: [
              {
                prefix: "uploaded", suffix: ".csv"
              }
            ],
            existing: true
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
