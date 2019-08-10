
const express = require('express');
const app = express();
const path = require('path');
const bloomfilter =  require('./bloomfilter.js');

const API_PORT = process.env.HTTP_PORT || 4001;

// instantiate our bloomfilter
const bf = new bloomfilter(size=100000);

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// create router for bloomfilter
var bfRouter = express.Router();

// get instance of bloomfilter
bfRouter.get('/', async function(req, res) {
	// create our bitvector for the bloomfilter
	await bf.createStore();
	
	res.json({ data: bf.store });
});

// search word in bloomfilter
bfRouter.get('/:word', function(req, res) {
	res.json({ contains: bf.contains(req.params.word) });
});

app.use('/bloomfilter', bfRouter);

// // loads roughly 274k words
// app.get('/words', function(req, res) {
// 	const words = fs.readFileSync(wordListPath, 'utf-8').split('\n');
// 	res.json({ data: words });
// });


// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));