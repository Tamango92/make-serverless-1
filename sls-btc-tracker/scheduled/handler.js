const got = require('got');
const uuid = require('node-uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;
const ENDPOINT = 'https://api.cryptonator.com/api/ticker/btc-usd';

module.exports.trackBtc = (event, context, callback) => {

    getPrice()
        .then(savePrice)
        .then(finish)
        .catch(errorHappened);

    function finish() {
        callback(null, 'Done');
    }

    function errorHappened(err) {
        callback(err);
    }
};

function getPrice() {
    return got(ENDPOINT).then(data => {
        return JSON.parse(data.body)['ticker']['price'];
    });
}

function savePrice(price) {
    const date = new Date();
    const params = {
        TableName: TABLE,
        Item: {
            fetchId: uuid.v4(),
            price: price,
            timestamp: date.toISOString()
        }
    };
    return dynamoDb.put(params).promise();
}
