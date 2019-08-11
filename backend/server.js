const bloomfilter =  require('./bloomfilter.js');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const app = express();
const API_PORT = process.env.HTTP_PORT || 4001;

// hold pointer to bloom filter
var bf = new bloomfilter(size=Math.pow(10, 8));
bf.createStore();

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// create router for bloomfilter
var bfRouter = express.Router();

// gets info on bloom filter (i.e. it's size)
bfRouter.get('/', function(req, res) {
	res.json({ size: bf.size });
});

// creates new bloom filter and sets size of bit vector
bfRouter.post('/', function(req, res) {
	const sizePowerOfTen = req.body.size;

	if (sizePowerOfTen != null) {
		bf = new bloomfilter(size=Math.pow(10, sizePowerOfTen));
		bf.createStore();
		res.json({ size: sizePowerOfTen });
	} else {
		// if too large, will exceed js heap bound and send 405
		res.sendStatus(405);
	}
});

// search word in bloomfilter
bfRouter.get('/:word', function(req, res) {
	const result = bf.contains(req.params.word);
	res.json({ contains: result });
});

app.use('/bloomfilter', bfRouter);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));