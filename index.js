const express = require('express');
const app = express();
const fs = require("fs");
const { writeFile } = require("fs/promises");

let currentVotes= 0;

fs.readFile("./data.txt", (err, inputD) => {
    if (err) throw err;
    currentVotes = inputD.toString();
});

app.locals.someFunction = function newVote() {
    currentVotes++;
}

app.get(`/api/newVote`, (req, res, next) => {
    currentVotes++;
    res.jsonp({status: 'success', currentVotes: currentVotes});
    writeToFile();
});

app.use(express.static('public'))

app.use(`/`, (req, res, next) => {
    res.render('index.pug', { currentVotes: currentVotes });
});


app.listen(3000, () => {
    console.log("started!");
});

async function writeToFile() {
    await writeFile("./data.txt", currentVotes.toString(), (err) => {
        if (err) throw err;
    });
}