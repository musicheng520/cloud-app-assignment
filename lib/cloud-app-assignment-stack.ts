import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CloudAppAssignmentStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // =========================
    // DynamoDB
    // =========================
    const movieTable = new dynamodb.Table(this, 'MovieTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // =========================
    // Lambdas
    // =========================
    const getMovieRoles = new lambdaNodejs.NodejsFunction(this, 'GetMovieRoles', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lambda/getMovieRoles.ts',
      handler: 'handler',
      environment: { TABLE_NAME: movieTable.tableName }
    });

    const getActor = new lambdaNodejs.NodejsFunction(this, 'GetActor', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lambda/getActor.ts',
      handler: 'handler',
      environment: { TABLE_NAME: movieTable.tableName }
    });

    const getMovie = new lambdaNodejs.NodejsFunction(this, 'GetMovie', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lambda/getMovie.ts',
      handler: 'handler',
      environment: { TABLE_NAME: movieTable.tableName }
    });

    const postMovieRole = new lambdaNodejs.NodejsFunction(this, 'PostMovieRole', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lambda/postMovieRole.ts',
      handler: 'handler',
      environment: { TABLE_NAME: movieTable.tableName }
    });

    // =========================
    // Permissions
    // =========================
    movieTable.grantReadData(getMovieRoles);
    movieTable.grantReadData(getActor);
    movieTable.grantReadData(getMovie);
    movieTable.grantWriteData(postMovieRole);

    getActor.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["translate:TranslateText"],
        resources: ["*"]
      })
    );

    // =========================
    // API Gateway + CORS
    // =========================
    const api = new apigateway.RestApi(this, 'MovieApi', {
      restApiName: 'Movie Service'
    });

    const corsOptions = {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'X-Api-Key']
    };

    // /movies
    const movies = api.root.addResource('movies', {
      defaultCorsPreflightOptions: corsOptions
    });

    // /movies/{movieID}
    const movie = movies.addResource('{movieID}', {
      defaultCorsPreflightOptions: corsOptions
    });

    // /movies/role  
    const role = movies.addResource('role', {
      defaultCorsPreflightOptions: corsOptions
    });

    // /actors
    const actors = api.root.addResource('actors', {
      defaultCorsPreflightOptions: corsOptions
    });

    // /actors/{actorID}
    const actor = actors.addResource('{actorID}', {
      defaultCorsPreflightOptions: corsOptions
    });

    // =========================
    // Methods
    // =========================

    // GET /movies/{movieID}
    movie.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getMovie)
    );

    // GET /movies/{movieID}/role
    const movieRole = movie.addResource('role', {
      defaultCorsPreflightOptions: corsOptions
    });

    movieRole.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getMovieRoles)
    );

    // POST /movies/role 
    role.addMethod(
      'POST',
      new apigateway.LambdaIntegration(postMovieRole),
      {
        apiKeyRequired: true
      }
    );

    // GET /actors/{actorID}
    actor.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getActor)
    );

    // =========================
    // API Key
    // =========================
    const apiKey = api.addApiKey('MovieApiKey');

    const plan = api.addUsagePlan('UsagePlan', {
      name: 'movie-plan',
      throttle: {
        rateLimit: 10,
        burstLimit: 5
      }
    });

    plan.addApiKey(apiKey);
    plan.addApiStage({
      stage: api.deploymentStage
    });
  }
}