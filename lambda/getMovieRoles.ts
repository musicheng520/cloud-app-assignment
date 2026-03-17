import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {

  const movieID = event.pathParameters.movieID;

  const result = await client.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `m#${movieID}`
    }
  }));

  const roles = (result.Items || [])
    .filter((item: any) => item.SK.startsWith("a#"))
    .map((item: any) => ({
      roleName: item.roleName,
      roleDescription: item.roleDescription
    }));

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: roles
    })
  };
};