const config = require('./config');
const chrome = require('./chrome');
const CDP = require('chrome-remote-interface');
const ScreenshotOperator = require('./screenshotOperator');

module.exports.screenshot = function(event, context, callback) {
    console.log(event);
    const url = event.queryStringParameters.url || 'google.com';

    chrome
        .isLaunched()
        .timeout(config.LAUNCH_TIMEOUT, 'Chrome was launching too long. Task terminated')
        .then(() => new ScreenshotOperator(CDP, url))
        .then(oper => {
            return oper
                .openTab()
                .then(() => oper.openClient())
                .then(() => oper.setupClient())
                .then(() => oper.navigate())
                .then(() => oper.capture())
                .then(() => oper.destroyConnections())
        })
        .then(finish)
        .catch(errorHappened);

    function finish(image) {
        console.log(image);
        const response = {
            statusCode: 200,
            body: `<img src="data:image/png;base64,${image}" style="border: 2px solid red;">`,
            headers: { "Content-Type" : "text/html" }
        };
        callback(null, response);
    }

    function errorHappened(err) {
        callback(err);
    }
};
