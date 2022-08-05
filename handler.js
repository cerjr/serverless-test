'use strict';

const AWS = require('aws-sdk');

module.exports.functionA = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        value: event,
      },
      null,
      2
    ),
  };
};

module.exports.functionB = async (event) => {
  const body = JSON.parse(event.body);

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName : process.env.DYNAMODB_TABLE,
    Key: {
      "primary_key": {S: body.key}
    }
  };

  const reg = await dynamoDb.get(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        input: event,
        value: !!reg
      },
      null,
      2
    ),
  };
};

module.exports.functionC = async (event) => {
  const body = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        input: event,
        value: {...body, output: "BBB"}
      },
      null,
      2
    ),
  };
};