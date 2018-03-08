const AWS = require('aws-sdk');
const sharp = require('sharp');
const Promise = require('bluebird');
const s3Bucket = new AWS.S3({params: {Bucket: process.env.BUCKET}});

module.exports.resizeImage = function(event, context, callback) {
    const objectInfo = event.Records[0].s3.object;
    console.log(objectInfo);

    getImageFromS3(objectInfo.key)
        .then(makeResizedImage)
        .then(saveResized)
        .then(finish)
        .catch(errorHappened);


    function finish() {
        console.log('Done');
        callback(null, 'Done');
    }

    function errorHappened(err) {
        console.log(err);
        callback(err);
    }
};

function getImageFromS3(key) {
    return new Promise((resolve, reject) => {
        s3Bucket.getObject({Key: key}, (err, result) => {
            if (err) {
                return reject(err);
            }
            result.key = key;
            resolve(result);
        });
    });
}

function makeResizedImage(image) {
    console.log('resizing', image);
    const key = image.key.split('uploaded/')[1];
    return sharp(image.Body)
        .rotate()
        .resize(876, 672)
        .background({r: 0, g: 0, b: 0, alpha: 1})
        .embed()
        .toBuffer()
        .then((imageBuffer) => {
        console.log(imageBuffer, key);
        return {imageBuffer, key}
    })
}

function saveResized({imageBuffer, key}) {
    return new Promise((resolve, reject) => {
        let params = {
            Key: 'resized/' + key,
            Body: imageBuffer,
            ContentType: 'image/jpeg'
        };
        return s3Bucket.upload(params, (err) => {
            console.log('uploading', params)
            if (err) return reject(err);
            resolve();
        })
    })
}
