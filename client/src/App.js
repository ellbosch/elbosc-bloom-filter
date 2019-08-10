import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import BloomFilter from './bloomFilter';

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Hello!</h1>
        <Route path="/" exact component={Home} />
        <Route path="/bloomfilter" component={BloomFilter} />
        <Route path="/bloomfilter/:word" component={SpellChecker} />
      </div>
    </Router>
  );
}

function Home() {
  return (
    <h2>Home</h2>
  )
}

function BloomFilter() {
	// fetch response from server
	useEffect(() => {
		fetch('/bloomfilter')
		.then(res => res.json())
		.then(
			(result) => {
				console.log(result);
			}
		)
	});

	return (
		<h2>Bloom Filter</h2>
	)
}

function SpellChecker({match}) {
  const [result, setResult] = useState(null);
  
  const word = match.params.word;

  // fetch response from server
	useEffect(() => {
		fetch('/bloomfilter/' + word)
		.then(
			(result) => {
        if (result.status === 200) {
          setResult('Maybe Valid');
        } else {
          setResult('Not Valid');
        }
			}
		)
  });
  
  return (
    <h4>{result}</h4>
  )
}

export default App;