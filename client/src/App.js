import React, { useState, useEffect } from 'react';

function App() {
  const [queryString, setQueryString] = useState("");

  return (
    <div className="container text-center">
      <h1>Bloom Filter</h1>
      <input type="text" className="form-control" placeholder="Look up word in bloom filter" aria-label="Search word" aria-describedby="button-search" value={queryString} onChange={e => setQueryString(e.target.value)} />
      <br />
      <QueryResult query={queryString} />
    </div>
  );
}

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

  return (
    <div className={alertClass} role="alert">
      {result}
    </div>
  );
}

export default App;