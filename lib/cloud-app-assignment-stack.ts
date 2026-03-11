import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CloudAppAssignmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  
    const movieTable = new dynamodb.Table(this, 'MovieTable', {
    partitionKey: {
      name: 'PK',
      type: dynamodb.AttributeType.STRING
    },

    sortKey: {
      name: 'SK',
      type: dynamodb.AttributeType.STRING
    },

    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,

    removalPolicy: cdk.RemovalPolicy.DESTROY
  });
  }
}
