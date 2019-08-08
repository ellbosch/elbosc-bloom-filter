
const express = require('express');
const app = express();
const path = require('path');
const bloomfilter =  require('./bloomfilter.js');


const API_PORT = process.env.HTTP_PORT || 4001;

// instantiate bloomfilter
var myBloomFilter = null;

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// loads roughly 274k words
app.get('/words', function(req, res) {
	const words = fs.readFileSync(wordListPath, 'utf-8').split('\n');
	res.json({ data: words });
});

// create a bloomfilter
// app.get('/bloomfilter', function(req, res) {
// 	console.log("SANITY CHECK");
// 	myBloomfilter = BloomFilter(size=1000);

// 	console.log(myBloomFilter.store);

// 	res.sendStatus(200);
// });

// // search word in bloomfilter
// app.get('/bloomfilter/<word>', function(req, res) {
// 	// nil case or do singleton


// });

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));