import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {

  const actorID = event.pathParameters.actorID;
  const movie = event.queryStringParameters?.movie;  

  // ---------- 1. get actor ----------

  const actorResult = await client.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `a#${actorID}`
    }
  }));

  const actor = actorResult.Items?.[0];

  // ---------- 2. if no movie → return actor ----------

  if (!movie) {
    return {
      statusCode: 200,
      body: JSON.stringify(actor)
    };
  }

  // ---------- 3. get role ----------

  const roleResult = await client.send(new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `m#${movie}`,
      SK: `a#${actorID}`
    }
  }));

  const role = roleResult.Item;

  // ---------- 4. return combined ----------

  return {
    statusCode: 200,
    body: JSON.stringify({
      actor,
      role
    })
  };
};