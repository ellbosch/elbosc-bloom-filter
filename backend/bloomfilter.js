const wordListPath = require('word-list');
const fs = require('fs');
const hasha = require('hasha');
const farmhash = require('farmhash');

module.exports = class BloomFilter {
	constructor(size=1000) {
		this.size = size;
		this.store = this.initializeStore();
	}

	// init(callback) {
	// 	(async() => {
	// 		console.log('in async');
	// 		const wordList = await this.getWordsList();
	// 		this.createStore(wordList);
	// 	});
	// 	callback.bind(this)();
	// }

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
			this.addWord(word);
		}
	}

	// calculates hash for word
	getHash(word) {
		// var value = 0;
		const hashString = hasha(word, { algorithm: 'md5' });
		const value = farmhash.fingerprint32(hashString);		// converts hash string to 32 bit integer

		// for (var i = 0; i < hashString.length; i++) {
		// 	const charCode = hashString.charCodeAt(i);
		// 	value = value + charCode;
		// }
		console.log(value % this.size);
		// use modulo to keep value under size limit
		return value % this.size;
	}

	// run word through hashing algorithms and place values in store
	addWord(word) {
		const hash = this.getHash(word);
		this.store[hash % this.size] = 1;			// return modulo of hash value with size of our store
	}


	// search in store to see if word is (maybe) valid or definitely not valid
	contains(word) {
		const hash = this.getHash(word);
		return this.store[hash];
	}

	async getWordsList() {
		const wordsList = await fs.readFileSync(wordListPath, 'utf8').split('\n');
		return wordsList;
	}
}

// class DataProvider {
// 	constructor() {
// 		this.wordsList = [];
// 	}

// 	static async getWordsList() {
// 		if (this.wordsList.length == 0) {
// 			return new Promise(resolve => {
// 				this.wordsList = fs.readFileSync(wordListPath, 'utf8').split('\n');
// 				resolve(this.wordsList);
// 			});
// 		} else {
// 			return this.wordsList;
// 		}
// 	}

// }