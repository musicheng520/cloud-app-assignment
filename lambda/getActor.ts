import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {

  const actorID = event.pathParameters.actorID;

  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `a#${actorID}`
    }
  };

  const command = new QueryCommand(params);
  const result = await client.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  };
};