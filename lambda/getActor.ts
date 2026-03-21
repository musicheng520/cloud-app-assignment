import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const client = new DynamoDBClient({});
const translateClient = new TranslateClient({});

export const handler = async (event: any) => {

  const actorID = event.pathParameters.actorID;
  const movie = event.queryStringParameters?.movie;
  const language = event.queryStringParameters?.language;

  // ---------- 1. get actor ----------

  const actorResult = await client.send(new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `a#${actorID}`,
      SK: `a#${actorID}`
    }
  }));

  const item = actorResult.Item;

  let actor = item ? {
    name: item.name,
    bio: item.bio,
    dob: item.dob
  } : null;

  if (!actor) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Actor not found" })
    };
  }

  // ---------- 2. get role ----------

  let role: any = null;

  if (movie) {
    const roleResult = await client.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `m#${movie}`,
        SK: `a#${actorID}`
      }
    }));

    const roleItem = roleResult.Item;

    role = roleItem ? {
      roleName: roleItem.roleName,
      roleDescription: roleItem.roleDescription
    } : null;
  }

  // ---------- 3. translation (optional) ----------

  if (language) {

    // translate actor bio
    const bioResult = await translateClient.send(
      new TranslateTextCommand({
        Text: actor.bio,
        SourceLanguageCode: "en",
        TargetLanguageCode: language
      })
    );

    actor.bio = bioResult.TranslatedText;

    // translate role description if exists
    if (role && role.roleDescription) {
      const roleResult = await translateClient.send(
        new TranslateTextCommand({
          Text: role.roleDescription,
          SourceLanguageCode: "en",
          TargetLanguageCode: language
        })
      );

      role.roleDescription = roleResult.TranslatedText;
    }
  }

  // ---------- 4. return ----------

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      data: {
        actor,
        role
      }
    })
  };
};