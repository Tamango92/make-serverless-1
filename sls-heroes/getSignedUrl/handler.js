const AWS = require('aws-sdk');
const bucket = new AWS.S3({params: {Bucket: process.env.BUCKET}})

module.exports.getSignedUrl = (event, context, callback) => {
    const params = event.queryStringParameters;

    bucket.getSignedUrl('putObject', {
      Key:params.key,
      Expires: 30,
      ContentType:params.ctype
    }, (err, signedUrl) => {
        if (err) return callback(err);
        let response = {
            statusCode: '200',
            body: JSON.stringify({ url: signedUrl }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
        callback(null, response);
    });
};
