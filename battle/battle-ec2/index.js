const express = require('express');
const dumbLoad = require('./dumbLoad');
const app = express();

app.use('/dumb', (req, res, next) => {
    console.log('req!');
    dumbLoad((lastVal) => {
        console.log('Success ', lastVal);
        return res.status(200).send();
    });
});

app.use('/hc', (req, res, next) => {
    res.status(200).send();
});

app.listen(5000);
console.log('Listening...');
