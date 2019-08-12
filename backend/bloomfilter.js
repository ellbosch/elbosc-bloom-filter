const wordListPath = require('word-list');
const fs = require('fs');
const crypto = require('crypto');
const farmhash = require('farmhash');
const bitVector = require('bit-vector');

module.exports = class BloomFilter {
	constructor(sizePowerOfTen=8, usesMd5=true, usesSha1=true, usesSha256=true) {
		// only proceed if there's a selected algorithm
		if (!usesMd5 && !usesSha1 && !usesSha256) {
			throw("Must select an algorithm!");
		}
		if (sizePowerOfTen == "") {
			sizePowerOfTen = 8;
		}
		this.sizePowerOfTen = sizePowerOfTen;
		this.size = Math.pow(10, sizePowerOfTen);
		
		// if too large, bit vector can break
		try {
			this.store = this.initializeStore();
		} catch {
			throw new Error("Unable to create bit vector at this size!");
		}
		
		// set which algorithms we'll use for hashing
		this.usesMd5 = usesMd5;
		this.usesSha1 = usesSha1;
		this.usesSha256 = usesSha256;
	}

	// initialize store with 0's
	initializeStore() {
		return bitVector.createBv(this.size);
	}

	// initialize our bitvector
	async createStore() {
		const wordList = await this.getWordsList();

		// run each word through hash and store in bitvector
		wordList.forEach(word => {
			this.addHash(word);
		});
	}

	// run word through hashing algorithms and place values in store
	addHash(word) {
		const values = this.getHashValues(word);
		values.forEach(hash => {
			bitVector.setBit(this.store, hash);
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
		for (const hash of values) {
			if (!bitVector.getBit(this.store, hash)) {
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