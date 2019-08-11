const wordListPath = require('word-list');
const fs = require('fs');
const crypto = require('crypto');
const farmhash = require('farmhash');

module.exports = class BloomFilter {
	constructor(size=1000, usesMd5=true, usesSha1=true, usesSha256=true) {
		this.size = size;
		this.store = this.initializeStore();
		
		// set which algorithms we'll use for hashing
		this.usesMd5 = usesMd5;
		this.usesSha1 = usesSha1;
		this.usesSha256 = usesSha256;
	}

	// initialize store with 0's
	initializeStore() {
		var store = [];

		// first initialize to array of 0's
		for (var i = 0; i < this.size; i++) {
			store.push(0);
		}
		return store;
	}

	// initialize our bitvector
	async createStore() {
		const wordList = await this.getWordsList();

		// run each word through hash and store in bitvector
		for (var i = 0; i < wordList.length; i++) {
			const word = wordList[i];
			this.addHash(word);
		}

		// var counter = 0;
		// this.store.forEach(element => {
		// 	counter = counter + element;
		// });
		// console.log(counter / this.size);
	}

	// run word through hashing algorithms and place values in store
	addHash(word) {
		const values = this.getHashValues(word);
		values.forEach(hash => {
			this.store[hash] = 1;
		});
	}

	// get all hash values
	getHashValues(word) {
		var values = [];

		if (this.usesMd5) {
			values.push(this.getHash(word, 'md5'));
		}

		if (this.usesSha1) {
			values.push(this.getHash(word, 'sha1'));
		}

		if (this.usesSha256) {
			values.push(this.getHash(word, 'sha256'));
		}

		return values;
	}

	// calculates md5 hash for word
	getHash(word, algorithm) {
		const hashString = crypto.createHash(algorithm).update(word).digest('hex');
		const hashInt = farmhash.fingerprint32(hashString);				// converts hash string to 32 bit integer

		// use modulo to keep value under size limit
		return hashInt % this.size;
	}

	// search in store to see if word is (maybe) valid or definitely not valid
	contains(word) {
		const values = this.getHashValues(word);

		// if any hash value isn't in our store, return false
		for (let hash of values) {
			if (!this.store[hash]) {
				return false;
			}
		}
		return true;
	}

	// our dictionary of words
	async getWordsList() {
		const wordsList = await fs.readFileSync(wordListPath, 'utf8').split('\n');
		return wordsList;
	}
}