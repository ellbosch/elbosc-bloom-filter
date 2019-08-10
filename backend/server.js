
const express = require('express');
const app = express();
const path = require('path');
const bloomfilter =  require('./bloomfilter.js');

const API_PORT = process.env.HTTP_PORT || 4001;

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// create router for bloomfilter
var bfRouter = express.Router();

// get instance of bloomfilter
bfRouter.get('/', async function(req, res) {
	const bf = new bloomfilter(size=100000);
	await bf.createStore();
	console.log("store: " + bf.store);
	
	// load bloom filter bitvector after instantiation
	// bf.init(function() {
	// 	const store = bf.store;
	// 	console.log("in callback " + store);
	// });
	
	res.json({ data: bf.store });
});

// search word in bloomfilter
bfRouter.get('/:word', function(req, res) {
	// nil case or do singleton
});

app.use('/bloomfilter', bfRouter);

// // loads roughly 274k words
// app.get('/words', function(req, res) {
// 	const words = fs.readFileSync(wordListPath, 'utf-8').split('\n');
// 	res.json({ data: words });
// });


// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));