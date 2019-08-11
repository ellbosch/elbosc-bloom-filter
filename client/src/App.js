import React, { useState, useEffect, useCallback } from 'react';

function App() {
  const [queryString, setQueryString] = useState("");

  return (
    <div className="container text-center">
      <h1>Bloom Filter</h1>
      <input type="text" className="form-control" placeholder="Look up word in bloom filter" aria-label="Search word"
          aria-describedby="button-search" value={queryString} onChange={e => setQueryString(e.target.value)} />
      <br />
      <Controls />
      <QueryResult query={queryString} />
    </div>
  );
}

function Controls() {
  const [vectorSize, setVectorSize] = useState(8);   // let user control bit vector (set to powers of 10)
  const createBloomFilter = useCallback(() => {
    fetch('/bloomfilter', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        'size': vectorSize
      })
    });
  }, [vectorSize]);

  return (
    <div className="row align-items-center">
      <div className="col-auto">
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text" id="vector-size-addon">Vector Size in 0's</span>
          </div>
          <input type="text" className="form-control" placeholder="Power of 10" aria-label="Vector Size"
              aria-describedby="vector-size-addon" value={vectorSize} onChange={e => setVectorSize(e.target.value)} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={createBloomFilter}>Create</button>
          </div>
        </div>
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

  return (
    <div className={alertClass} role="alert">
      {result}
    </div>
  );
}

export default App;