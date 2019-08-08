const wordListPath = require('word-list');
const fs = require('fs');

module.exports = class BloomFilter {
	constructor(size=1000) {
		this.size = size;
		this.store = this.createStore();
	}

	// initialize our bitvector to 0's
	createStore() {
		var store = [];

		for (var i = 0; i < this.size; i++) {
			store.push(0);
		}

		return store;
	}

	// run word through hashing algorithms and place values in store
	addWord(word) {

	}

	// search in store to see if word is (maybe) valid or definitely not valid
	searchWord(word) {
		
	}
}