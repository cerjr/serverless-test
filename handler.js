'use strict';

const AWS = require('aws-sdk');
const { MustRetryError } = require('./errors');

module.exports.functionA = async (event) => {
  return {
    statusCode: 200,
    body: jsonAsString(
      {
        value: event,
      }),
  };
};

module.exports.functionB = async (event) => {
  const body = JSON.parse(event.body);
  console.log(body);
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName : process.env.DYNAMODB_TABLE,
    Key: {
      "primary_key": body.value.key
    }
  };

  const reg = await dynamoDb.get(params).promise();
  console.log(reg.Item);

  if (!reg["Item"]) {
    throw new MustRetryError('This is a custom error!');
  }

  return {
    statusCode: 200,
    body: jsonAsString(
      {
        input: event,
        value: reg["Item"]
      }),
  };
};

module.exports.functionC = async (event) => {
  const body = JSON.parse(event.body);
  console.log(body.value);

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName : process.env.DYNAMODB_TABLE,
    Key: {
      "primary_key": body.value.primary_key
    },
    UpdateExpression: "set #text = :newText",
    ExpressionAttributeValues: {
      ":newText": body.value.primary_key.toLowerCase()+":functionC",
    },
    ExpressionAttributeNames: {
      "#text": "text",
    },
    ReturnValues: "UPDATED_NEW",
  }

  const reg = await dynamoDb.update(params).promise()

  return {
    statusCode: 200,
    body: jsonAsString({
      input: event,
      value: reg.Item
    }) 
  }
};

function jsonAsString(obj) {
  return JSON.stringify(
    obj,
    null,
    2
  );
}
