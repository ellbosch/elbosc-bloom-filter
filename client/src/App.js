import React, { useState, useEffect } from 'react';

function App() {
  const [queryString, setQueryString] = useState("");

  return (
    <div className="container">
      <h1 className="text-center">Bloom Filter</h1>
      <input type="text" className="form-control" placeholder="Look up word in bloom filter" aria-label="Search word"
          aria-describedby="button-search" value={queryString} onChange={e => setQueryString(e.target.value)} />
      <br />
      <Controls size={8} setWordLookUpQuery={setQueryString} />
      <QueryResult query={queryString} />
    </div>
  );
}

function Controls(props) {
  const [vectorSizeServer, setVectorSizeServer] = useState(props.size);   // current state of vector size from server
  const [vectorSizeQuery, setVectorSizeQuery] = useState("");             // query string for vector size

  function createBloomFilter() {
    fetch('/bloomfilter', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        'size': vectorSizeQuery
      })
    })
    .then(res => res.json())
    .then(
      (result) => {
        // UI updates with new size of bit vector and removes text from word lookup input
        setVectorSizeServer(result.size);
        props.setWordLookUpQuery("");
      }
    )
  }

  return (
    <div className="row">
      <div className="col-auto">
        <div className="input-group input-group-sm mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text">Vector Size in 0's</span>
          </div>
          <input type="text" className="form-control" id="vector-size-input" placeholder="Power of 10" aria-label="Vector Size"
              aria-describedby="vector-size-button" value={vectorSizeQuery} onChange={e => setVectorSizeQuery(e.target.value)} />
          <div className="input-group-append">
            <button id="vector-size-button" className="btn btn-outline-secondary" type="button" onClick={createBloomFilter}>Create</button>
          </div>
        </div>
        <span><small><strong>Current Bit Vector Size: 10<sup>{vectorSizeServer}</sup></strong></small></span>
      </div>
    </div>
  )
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

export default App;