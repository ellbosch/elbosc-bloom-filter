import React, { useState, useEffect } from 'react';

// Displays result of user-inputted query in our spell checker
function QueryResult(props) {
	const queryString = props.query;
	const [result, setResult] = useState(null);
	const [alertClass, setAlertClass] = useState(null);   // determines color of alert

	useEffect(() => {
		if (queryString !== "") {
			fetch('/bloomfilter/' + queryString)
				.then(res => res.json())
				.then(
					(result) => {
						if (result.contains) {
							setResult("Bloom filter may contain \"" + queryString + "\"");
							setAlertClass("alert alert-primary");
						} else {
							setResult("Bloom filter does not contain \"" + queryString + "\"");
							setAlertClass("alert alert-warning");
						}
					}
				)
		}
	});

	// only show result if we have a string in query
	if (queryString !== "") {
		return (
			<div className={alertClass} role="alert">
				{result}
			</div>
		)
	}
	return null;
}

export default QueryResult;