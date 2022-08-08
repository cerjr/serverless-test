'use strict';
const AWS = require('aws-sdk');

module.exports.createCustomer = async (event) => {
  // const body = JSON.parse(Buffer.from(event.body, 'base64').toString());
  const body = JSON.parse(event.body);
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const putParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      primary_key: body.key.toUpperCase(),
      text: body.key.toLowerCase(),
    },
  };
  await dynamoDb.put(putParams).promise();

  return {
    statusCode: 201,
  };
};