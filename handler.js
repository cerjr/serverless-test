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
    function MustRetryError(message) {
        this.name = 'MustRetryError';
        this.message = message;
    }
    MustRetryError.prototype = new Error();

    throw new MustRetryError('This is a custom error!');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        input: event,
        value: reg["Item"]
      },
      null,
      2
    ),
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
    body: JSON.stringify(
      {
        input: event,
        value: reg.Item
      },
      null,
      2
    ),
  };
};