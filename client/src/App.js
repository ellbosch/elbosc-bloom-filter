import React, { useState, useEffect } from 'react';

function App() {
  const [queryString, setQueryString] = useState("");

  return (
    <div className="container">
      <h1 className="text-center" id="header-main">Bloom Filter</h1>
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
    <form className="form-inline">
      <div className="col-auto col-control">
        <div className="form-group">
          <label className="mr-2" htmlFor="vector-size-input">Vector Size in 0's</label>
          <input type="text" className="form-control form-control-sm" id="vector-size-input" placeholder="Power of 10" aria-label="Vector Size"
              value={vectorSizeQuery} onChange={e => setVectorSizeQuery(e.target.value)} />
        </div>
        <span><small>Current Bit Vector Size: 10<sup>{vectorSizeServer}</sup></small></span>
      </div>
      <div className="col-auto col-control">
        <div className="form-group mb-1">
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="inlineCheckboxMd5" value="md5" />
            <label className="form-check-label" htmlFor="inlineCheckboxMd5">MD5</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="inlineCheckboxSha1" value="sha1" />
            <label className="form-check-label" htmlFor="inlineCheckboxSha1">SHA-1</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="inlineCheckboxSha256" value="sha256"/>
            <label className="form-check-label" htmlFor="inlineCheckboxSha256">SHA-256</label>
          </div>
        </div>
        <span><small>Current Algorithms: ???</small></span>
      </div>
      <div className="col-auto">
        <button onClick={createBloomFilter} className="btn btn-primary my-1">Create</button>
      </div>
    </form>
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