import React, { useState } from 'react';

// Customizable controls for bloom filter
function Controls(props) {
	const [vectorSizeInput, setVectorSizeInput] = useState(props.size);                         // query string for vector size
	const [vectorSizeServer, setVectorSizeServer] = useState(props.size);               // current state of vector size from server

	// algorithms currently selected on client
	const [md5Checkbox, setMd5Checkbox] = useState(props.algorithms["MD5"]);
	const [sha1Checkbox, setSha1Checkbox] = useState(props.algorithms["SHA-1"]);
	const [sha256Checkbox, setSha256Checkbox] = useState(props.algorithms["SHA-256"]);

	const [algorithmsServer, setAlgorithmsServer] = useState(booleanDictToString(props.algorithms));    // algorithms currently selected on server
	const [errorString, setErrorString] = useState("");

	// post request for creating bloom filter
	function createBloomFilter(e) {
		e.preventDefault();

		try {
			validateForm();
			fetch('/bloomfilter', {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					'size': vectorSizeInput,
					'algorithms': {
						'MD5': md5Checkbox,
						'SHA-1': sha1Checkbox,
						'SHA-256': sha256Checkbox
					}
				})
			}).then(res => {
				return res.json();
			}).then(result => {
				if (result.error != null) {
					setErrorString(result.error);
				} else {
					// UI updates with new size of bit vector and removes text from word lookup input
					setVectorSizeServer(result.size);
					setAlgorithmsServer(booleanDictToString(result.algorithms));
					setErrorString("");
				}
			});
		} catch(err) {
			// show alert if error
			setErrorString(err.toString());
		}

		// reset word query input
		props.setWordLookUpQuery("");
	}

	// checks if form is valid for proceeding
	function validateForm() {
		// check if specified vector size 
		if (!Number.isInteger(parseInt(vectorSizeInput))) {
			// if blank, set to our default
			if (vectorSizeInput === "") {
				setVectorSizeInput(props.size);
			} else {
				throw new Error("Vector size is not a valid number!");
			}

		}
		// check if an algorithm is not selected
		if (!md5Checkbox && !sha1Checkbox && !sha256Checkbox) {
			throw new Error("Must select an algorithm!");
		}

	}

	// returns string friendly dictionary for true elements
	function booleanDictToString(dict) {
		const selected = Object.keys(dict).filter(key => dict[key]);
		return selected.join(", ");
	}

	const error = (<div className="alert alert-danger" role="alert">{errorString}</div>);
	const controls = (
		<form className="form-inline mb-3">
			<div className="col-auto col-control mb-3">
				<div className="form-group">
					<label className="mr-2" htmlFor="vector-size-input">Vector Size in 0's</label>
					<input type="text" className="form-control form-control-sm" id="vector-size-input" placeholder="Power of 10" aria-label="Vector Size"
						value={vectorSizeInput} onChange={e => setVectorSizeInput(e.target.value)} />
				</div>
				<span><small>Current Bit Vector Size: 10<sup>{vectorSizeServer}</sup></small></span>
			</div>
			<div className="col-auto col-control mb-3">
				<div className="form-group mb-1">
					<Checkbox label="MD5" state={[md5Checkbox, setMd5Checkbox]} />
					<Checkbox label="SHA-1" state={[sha1Checkbox, setSha1Checkbox]} />
					<Checkbox label="SHA-256" state={[sha256Checkbox, setSha256Checkbox]} />
				</div>
				<span><small>Current Algorithms: {algorithmsServer}</small></span>
			</div>
			<div className="col-sm-12 col-md-auto align-self-start">
				<button onClick={e => createBloomFilter(e)} className="btn btn-primary btn-sm">Create</button>
			</div>
		</form>
	);

	if (errorString !== "") {
		return (
			<div>
				{controls}
				{error}
			</div>
		)
	} else {
		return (
			<div>
				{controls}
			</div>
		)
	}
}

function Checkbox(props) {
	// hold value of checkbox in state
	const [isChecked, setIsChecked] = props.state;

	return (
		<div className="form-check form-check-inline">
			<input className="form-check-input" type="checkbox" id="inlineCheckboxMd5" checked={isChecked} value={props.label}
				onChange={() => setIsChecked(!isChecked)} />
			<label className="form-check-label" htmlFor="inlineCheckboxMd5">{props.label}</label>
		</div>
	)
}

export default Controls;