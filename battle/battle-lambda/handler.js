'use strict';
const dumbLoad = require('./dumbLoad');

module.exports.handler = (event, context, callback) => {
  const response = {
      statusCode: 200
  };

  dumbLoad((lastVal) => {
      console.log('\nSuccess: ', lastVal);
      return callback(null, response);
  });

};
