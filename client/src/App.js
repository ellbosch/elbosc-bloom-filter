import React, { useState, useEffect } from 'react';

function App() {
  const [queryString, setQueryString] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/bloomfilter/' + queryString)
    .then(res => res.json())
		.then(
			(result) => {
        if (result.contains) {
          setResult("Bloom filter may contain \"" + queryString + "\"");
        } else {
          setResult("Bloom filter does not contain \"" + queryString + "\"");
        }
			}
		)
  });

  return (
    <div className="container">
      <h1>Bloom Filter</h1>
      <input type="text" className="form-control" placeholder="Look up word in bloom filter" aria-label="Search word" aria-describedby="button-search" value={queryString} onChange={e => setQueryString(e.target.value)} />
      <div>
        {result}
      </div>
    </div>
  );
}

export default App;