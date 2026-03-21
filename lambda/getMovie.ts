import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {

  const movieID = event.pathParameters.movieID;

  const result = await client.send(new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `m#${movieID}`,
      SK: `m#${movieID}`
    }
  }));

  const item = result.Item;

  const movie = item ? {
    title: item.title,
    overview: item.overview,
    releaseDate: item.releaseDate
  } : null;

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      data: movie
    })
  };
};