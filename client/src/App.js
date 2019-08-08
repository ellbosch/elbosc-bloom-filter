import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import BloomFilter from './bloomFilter';

function App() {
  // const [wordsList, setWordsList] = useState(null);

  // fetch list of words
  // useEffect(() => {
  //   fetch('/words')
  //     .then(res => res.json())
  //     .then(
  //       (result) => {
  //         setWordsList(result.data)
  //       }
  //     )
  // });

  return (
    <Router>
      <h1>Hello!</h1>
      <Route path="/" exact component={Home} />
      <Route path="/bloomfilter" component={BloomFilter} />
    </Router>
  );
}

function Home() {
  return (
    <h2>Home</h2>
  )
}

function BloomFilter(props) {
	// const store

	// fetch response from server
	useEffect(() => {
		fetch('/bloomfilter?word=test')
		.then(res => res.json())
		.then(
			(result) => {
				console.log(result);
			}
		)
	});

	return (
		<h2>OOOH</h2>
	)
}

export default App;