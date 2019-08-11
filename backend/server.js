
const express = require('express');
const app = express();
const path = require('path');
const bloomfilter =  require('./bloomfilter.js');

const API_PORT = process.env.HTTP_PORT || 4001;

// instantiate our bloomfilter and create its bitvector
const bf = new bloomfilter(size=1000000);
bf.createStore();

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// create router for bloomfilter
var bfRouter = express.Router();

// get instance of bloomfilter
bfRouter.get('/', async function(req, res) {
	res.sendStatus(200);
});

// search word in bloomfilter
bfRouter.get('/:word', function(req, res) {
	const result = bf.contains(req.params.word);
	res.json({ contains: result });
});

app.use('/bloomfilter', bfRouter);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));