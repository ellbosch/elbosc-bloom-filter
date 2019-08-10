import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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

// create bloom filter
function BloomFilter() {
	// fetch response from server
	useEffect(() => {
		fetch('/bloomfilter')
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
    .then(res => res.json())
		.then(
			(result) => {
        if (result.contains) {
          setResult("Bloom filter may contain \"" + word + "\"");
        } else {
          setResult("Bloom filter does not contain \"" + word + "\"");
        }
			}
		)
  });
  
  return (
    <h4>{result}</h4>
  )
}

export default App;