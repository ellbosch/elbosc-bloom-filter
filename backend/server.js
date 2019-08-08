const express = require('express');
const path = require('path');
const wordListPath = require('word-list');
const fs = require('fs');

const API_PORT = process.env.HTTP_PORT || 4001;
const app = express();

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// loads roughly 274k words
app.get('/words', function(req, res) {
	const words = fs.readFileSync(wordListPath, 'utf-8').split('\n');
	res.json({ data: words });
});

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));