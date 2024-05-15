const express = require('express');
const app = express();
const fs = require("fs");
const { writeFile } = require("fs/promises");
const { rateLimit } = require("express-rate-limit")

const { TaskTimer } = require('tasktimer');
const timer = new TaskTimer(60000);

let currentVotes= 0;

fs.readFile("./data.txt", (err, inputD) => {
    if (err) throw err;
    currentVotes = inputD.toString();
});

const rateLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        status: 'failure',
        code: 429,
        message: "Slow Down Blud"
    },
    statusCode: 429
});

app.use(express.static('public'));

app.get(`/api/newVote`, rateLimiter, (req, res, next) => {
    currentVotes++;
    res.jsonp({status: 'success', code: 200});
    res.end();
});

app.get(`/api/currentVotes`, (req, res, next) => {
    res.jsonp({currentVotes: currentVotes});
    res.end();
});

app.use(`/`, (req, res, next) => {
    res.render('index.pug', { currentVotes: currentVotes });
});

app.listen(3000, () => {
    console.log("started!");
    // Start the task to save data to file every minute
    timer.add(async () => {
        await writeFile("./data.txt", currentVotes.toString(), (err) => {
            if (err) throw err;
        });
    }).start();
});
