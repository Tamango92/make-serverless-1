const config = require('./config');
const spawn = require('child_process').spawn;
const got = require('got');
const Promise = require('bluebird');
const fs = require('fs-extra');

let chrome;

function spawnChrome() {
    chrome = spawn(__dirname+'/headless-chrome/headless_shell', config.CHROME_FLAGS, {
        cwd: '/tmp',
        shell: true,
        detached: true,
        stdio: 'ignore'
    });
    chrome.unref();
    chrome.on('close', (code) => {
        console.log('Chrome closed with code: ', code);
        chrome = null;
        spawnChrome();
    });
}

spawnChrome();

module.exports = {
    isLaunched: function() {
        return new Promise((resolve, reject) => {
            let waiting = setInterval(() => {
                got(config.CHROME_URL+'/json', {retries: 0}).then(() => {
                    resolve();
                    clearInterval(waiting);
                }).catch((err) => {
                    console.log('Waiting for chrome...');
                });
            }, 100)
        });
    }
};



