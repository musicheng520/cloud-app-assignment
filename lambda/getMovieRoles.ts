import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {

  const movieID = event.pathParameters.movieID;
  const actorID = event.queryStringParameters?.actor; 

  const result = await client.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `m#${movieID}`
    }
  }));

  let roles = (result.Items || [])
    .filter((item: any) => item.SK.startsWith("a#"))
    .map((item: any) => ({
      actorID: item.SK.replace("a#", ""), 
      roleName: item.roleName,
      roleDescription: item.roleDescription
    }));

  // if actorID -> filter
  if (actorID) {
    roles = roles.filter((r: any) => r.actorID === actorID);
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      data: roles
    })
  };
};