import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class CloudAppAssignmentStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
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

    // Lambda (TypeScript)
    const getMovieRoles = new lambdaNodejs.NodejsFunction(this, 'GetMovieRoles', {

      runtime: lambda.Runtime.NODEJS_18_X,

      entry: 'lambda/getMovieRoles.ts',

      handler: 'handler',

      environment: {
        TABLE_NAME: movieTable.tableName
      }

    });

      const getActor = new lambdaNodejs.NodejsFunction(this, 'GetActor', {

        runtime: lambda.Runtime.NODEJS_18_X,

        entry: 'lambda/getActor.ts',

        handler: 'handler',

        environment: {
          TABLE_NAME: movieTable.tableName
        }

      });


    const api = new apigateway.RestApi(this, 'MovieApi', {
        restApiName: 'Movie Service'
      });

      const movies = api.root.addResource('movies');

      const movie = movies.addResource('{movieID}');

      const role = movie.addResource('role');

      const actors = api.root.addResource('actors');

      const actor = actors.addResource('{actorID}');

      role.addMethod(
        'GET',
        new apigateway.LambdaIntegration(getMovieRoles)
      );
  
      actor.addMethod(
        'GET',
        new apigateway.LambdaIntegration(getActor)
      );

    // Grant DynamoDB read permission
    movieTable.grantReadData(getMovieRoles);
    movieTable.grantReadData(getActor);
  }
}