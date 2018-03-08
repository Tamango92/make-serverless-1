const Promise = require('bluebird');

function ScreenshotOperator(CDP, url) {
    this.CDP = CDP;
    this.url = url;
    this.tab = null;
    this.client = null;
    this.image = null;
}

ScreenshotOperator.prototype.openTab = function() {
    console.log('open tab');
    return this.CDP.New().then((tab) => {
        this.tab = tab;
    });
};

ScreenshotOperator.prototype.openClient = function() {
    console.log('open connection');
    return this.CDP({tab: this.tab}).then((client) => {
        this.client = client;
    })
};

ScreenshotOperator.prototype.setupClient = function() {
    return Promise.all([
        this.client.Page.enable()
    ])
};

ScreenshotOperator.prototype.navigate = function() {
    console.log('navigating to: ', this.url);
    return new Promise((resolve, reject) => {
        this.client.Page.loadEventFired(() => {
            resolve();
        });
        this.client.Page.navigate({url: this.url});
    })
};

ScreenshotOperator.prototype.capture = function() {
    console.log('capturing');
    return this.client.Page.captureScreenshot({
        fromSurface: true,
        format: 'png'
    }).then((screenshot) => {
        this.image = screenshot.data;
    })
};

ScreenshotOperator.prototype.destroyConnections = function() {
    return Promise.all([
        this.client.close(),
        this.CDP.Close({id: this.tab.id})
    ]).then(() => {
        return this.image
    })
};

module.exports = ScreenshotOperator;

