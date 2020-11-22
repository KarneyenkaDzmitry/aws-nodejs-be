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
    },
    sqs: {
      name: "catalogItemsQueue"
    },
    sns: {
      topic_name: "createProductTopic",
      arn: "${cf:aws-nodejs-be-${self:provider.stage}.TopicARN}"
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
      DB_PORT: '${file(./env.json):DB_PORT}',
      PRODUCT_SERVICE_REGION: '${self:provider.region}',
      TOPIC_ARN: "${self:custom.sns.arn}"
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: "sqs:*",
        Resource: {
          "Fn::GetAtt": [
            "SQSQueue",
            "Arn"
          ]
        }
      }, {
        Effect: 'Allow',
        Action: "sns:*",
        Resource: {
          "Ref": "SNSTopic"
        }
      }
    ],
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
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            arn: {
              'Fn::Join': [':', ["arn", "aws", "sqs", { Ref: "AWS::Region" }, { Ref: "AWS::AccountId" }, "${self:custom.sqs.name}"]]
            },
            batchSize: 5
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      SNSSubscriptions: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "dkonevodov@gmail.com",
          Protocol: "email",
          TopicArn: { "Ref": "SNSTopic" },
          FilterPolicy: {

          }
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: "${self:custom.sns.topic_name}"
        }
      },
      SNSTopicPolicy: {
        Type: 'AWS::SNS::TopicPolicy',
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  "AWS": "*"
                },
                Action: ["sns:Publish"],
                Resource: {
                  "Ref": "SNSTopic"
                }
              }
            ]
          },
          Topics: [
            { "Ref": "SNSTopic" }
          ]
        }
      },
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "${self:custom.sqs.name}",
          ReceiveMessageWaitTimeSeconds: 20
        }
      },
      SQSQueuePolicy: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [
            {
              "Ref": "SQSQueue"
            }
          ],
          PolicyDocument: {
            Statement: [
              {
                Action: ["sqs:*"],
                Effect: "Allow",
                Resource: {
                  "Fn::GetAtt": [
                    "SQSQueue",
                    "Arn"
                  ]
                },
                Principal: {
                  AWS: "*"
                }
              }
            ]
          }
        }
      }
    },
    Outputs: {
      QueueName: {
        Description: "The name of the queue",
        Value: {
          "Fn::GetAtt": [
            "SQSQueue",
            "QueueName"
          ]
        }
      },
      QueueURL: {
        Description: "The URL of the queue",
        Value: {
          "Ref": "SQSQueue"
        }
      },
      QueueARN: {
        Description: "The ARN of the queue",
        Value: {
          "Fn::GetAtt": [
            "SQSQueue",
            "Arn"
          ]
        }
      },
      TopicName: {
        Description: "The name of the topic",
        Value: {
          "Fn::GetAtt": [
            "SNSTopic",
            "TopicName"
          ]
        }
      },
      TopicARN: {
        Description: "The ARN of the SNS-topic",
        Value: {
          "Ref": "SNSTopic"
        }
      }
    }
  }
}


module.exports = serverlessConfiguration;
