const AWS = require('aws-sdk');
const fs = require('fs');
const Promise = require('bluebird');
const FfmpegCommand = require('fluent-ffmpeg');
const videoshow = require('videoshow');
FfmpegCommand.setFfmpegPath(__dirname + '/ffmpeg-bin/ffmpeg');
FfmpegCommand.setFfprobePath(__dirname + '/ffmpeg-bin/ffprobe');

const s3Bucket = new AWS.S3({params: {Bucket: process.env.BUCKET}});

module.exports.makeVideo = function(event, context, callback) {

    getKeysList()
        .then((keys) => {
        return Promise.all(keys.map(getImageFromS3));
    })
        .then(makeShow)
        .then(saveVideo)
        .then(finish)
        .then(errorHappened)

    function finish() {
        console.log('Done');
        callback(null, 'Done');
    }

    function errorHappened(err) {
        console.log(err);
        callback(err);
    }
};

function getKeysList() {
    return new Promise((resolve, reject) => {
        s3Bucket.listObjects({Prefix: 'resized/'}, function(err, data) {
            if (err) {
                return reject(err);
            }
            const result = data.Contents.splice(0,20).map(obj => obj.Key);
            resolve(result);
        });
    });
}

function getImageFromS3(key) {
    return new Promise((resolve, reject) => {
        let fileName = '/tmp/' + key.split('resized/')[1];
        let file = fs.createWriteStream(fileName);
        file.on('close', function(){
            console.log('image downloaded ', fileName);
            resolve(fileName);
        });
        s3Bucket.getObject({Key: key})
            .createReadStream()
            .on('error', function(err){
                console.log(err);
                reject(err);
            }).pipe(file);
    });
}

function makeShow(fileNames) {
    console.log('MAKING SHOW!')
    let videoOptions = {
        fps: 12,
        loop: 2.3, // seconds
        transition: true,
        transitionDuration: 0.4, // seconds
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '876x?',
        audioBitrate: '64k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p'
    };

    return new Promise((resolve, reject) => {
        videoshow(fileNames, videoOptions)
            // .audio(__dirname + '/asset/song.mp3')
            .save('/tmp/heroes.mp4')
            .on('start', function (command) {
                console.log('ffmpeg process started:', command)
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err)
                console.error('ffmpeg stderr:', stderr)
                reject(err);
            })
            .on('end', function (output) {
                resolve();
                console.error('Video created in:', output)
            })
    });

}

function saveVideo() {
    let stream = fs.createReadStream('/tmp/heroes.mp4');
    console.log('upload video to s3');
    return new Promise((resolve, reject) => {
        let params = {
            Key: 'video/heroes.mp4',
            Body: stream,
            ContentType: 'video/mp4',
            ACL: 'public-read'
        };
        return s3Bucket.upload(params, (err) => {
            if (err) return reject(err);
            resolve();
        })
    })
}
