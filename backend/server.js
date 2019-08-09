
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
bfRouter.get('/', function(req, res) {
	const bf = new bloomfilter(size=10);
	
	// load bloom filter bitvector after instantiation
	// bf.init(function() {
	// 	console.log(bf.store);
	// });

	(async() => {
		const wordsList = await getWordsList();
		console.log(wordsList);
	});
	
	res.json({ data: bf.store });
});

async function getWordsList() {
	return "HI"
}

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