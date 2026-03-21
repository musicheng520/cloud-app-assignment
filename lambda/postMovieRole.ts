import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {

  try {

    const body = JSON.parse(event.body);

    const { movieID, actorID, roleName, roleDescription } = body;

    // ---------- validation ----------

    if (!movieID || !actorID || !roleName || !roleDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" })
      };
    }

    // ---------- put to DynamoDB ----------

    await client.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: `m#${movieID}`,
        SK: `a#${actorID}`,
        type: "role",
        movieID,
        actorID,
        roleName,
        roleDescription
      }
    }));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "Role added successfully"
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "Internal server error",
        error: error
      })
    };
  }
};