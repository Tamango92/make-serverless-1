const CHROME_URL = 'http://127.0.0.1:9222';

const CHROME_FLAGS = [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1200,800',
    '--no-sandbox',
    '--user-data-dir=/tmp/user-data',
    '--hide-scrollbars',
    '--enable-logging',
    '--log-level=0',
    '--v=99',
    '--single-process',
    '--data-path=/tmp/data-path',
    '--ignore-certificate-errors',
    '--homedir=/tmp',
    '--disk-cache-dir=/tmp/cache-dir'
];

const LAUNCH_TIMEOUT = 1500;

const LOAD_TIMEOUT = 10000;

module.exports = {
    CHROME_URL,
    CHROME_FLAGS,
    LAUNCH_TIMEOUT,
    LOAD_TIMEOUT
};