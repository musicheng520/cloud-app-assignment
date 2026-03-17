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

  const item = actorResult.Items?.[0];

  const actor = item ? {
    name: item.name,
    bio: item.bio,
    dob: item.dob
  } : null;

  // ---------- 2. if no movie → return actor ----------

  if (!movie) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: actor
      })
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

  const roleItem = roleResult.Item;

  const role = roleItem ? {
    roleName: roleItem.roleName,
    roleDescription: roleItem.roleDescription
  } : null;

  // ---------- 4. return combined ----------

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        actor,
        role
      }
    })
  };
};