import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {

  const movieID = event.pathParameters.movieID;

  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `m#${movieID}`
    }
  };

  const command = new QueryCommand(params);
  const result = await client.send(command);

  const roles = result.Items?.filter(
    (item: any) => item.SK.startsWith("a#")
  );

  return {
    statusCode: 200,
    body: JSON.stringify(roles)
  };
};