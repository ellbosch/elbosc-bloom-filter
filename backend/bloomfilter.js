const wordListPath = require('word-list');
const fs = require('fs');
const md5 = require('md5');

module.exports = class BloomFilter {
	constructor(size=1000) {
		this.size = size;
		this.store = this.initializeStore();
	}

	init(callback) {
		console.log("before async");
		(async() => {
			console.log('in async');
			await this.createStore();
		});
		console.log("after async");
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
		console.log("outside scope");

		// run each word through hash and store in bitvector
		for (var i = 0; i < this.wordList; i++) {
			const wordsList = await getWordsList();
			const word = wordsList[i];
			const hash = md5(word);
			console.log(hash);
		}

		// this.store = store;
	}

	// run word through hashing algorithms and place values in store
	addWord(word) {

	}

	// search in store to see if word is (maybe) valid or definitely not valid
	searchWord(word) {
		
	}
	async getWordsList() {
		const wordsList = await resolve(fs.readFileSync(wordListPath, 'utf8').split('\n'));
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