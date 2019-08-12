import React, { useState, useEffect } from 'react';

function App() {
  const [queryString, setQueryString] = useState("");

  return (
    <div className="container">
      <h1 className="text-center" id="header-main">Bloom Filter</h1>
      <p className="text-center"><em>Spellchecker with a customizable <a href="https://en.wikipedia.org/wiki/Bloom_filter">bloom filter</a>.</em></p>
      <input type="text" className="form-control" placeholder="Look up word in bloom filter" aria-label="Search word"
          aria-describedby="button-search" value={queryString} onChange={e => setQueryString(e.target.value)} />
      <br />
      <Controls size={8} setWordLookUpQuery={setQueryString} algorithms={{'MD5': true, 'SHA-1': true, 'SHA-256': true}} />
      <QueryResult query={queryString} />
    </div>
  );
}

// Customizable controls for bloom filter
function Controls(props) {
  const [vectorSizeInput, setVectorSizeInput] = useState("");                         // query string for vector size
  const [vectorSizeServer, setVectorSizeServer] = useState(props.size);               // current state of vector size from server
  const [md5Checkbox, setMd5Checkbox] = useState(props.algorithms["MD5"]);            // algorithms currently selected on client
  const [sha1Checkbox, setSha1Checkbox] = useState(props.algorithms["SHA-1"]);        // algorithms currently selected on client
  const [sha256Checkbox, setSha256Checkbox] = useState(props.algorithms["SHA-256"]);  // algorithms currently selected on client
  const [algorithmsServer, setAlgorithmsServer] = useState(booleanDictToString(props.algorithms));    // algorithms currently selected on server
  const [errorString, setErrorString] = useState("");

  // post request for creating bloom filter
  function createBloomFilter(e) {
    e.preventDefault();

    fetch('/bloomfilter', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
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
        // show alert if error
        setErrorString(result.error);
      } else {
        // UI updates with new size of bit vector and removes text from word lookup input
        setVectorSizeServer(result.size);
        setAlgorithmsServer(booleanDictToString(result.algorithms));
        setErrorString("");
      }
      props.setWordLookUpQuery("");
    })
  }
  
  // returns string friendly dictionary for true elements
  function booleanDictToString(dict) {
    var selected = [];

    for (var key in dict) {

      if (dict[key]) {
        selected.push(key);
      }
    }
    if (selected.length === 0) {
      return "None";
    }
    return selected.join(", ");
  }

  const error = (<div className="alert alert-danger" role="alert">{errorString}</div>);
  const controls = (
    <form className="form-inline">
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
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="inlineCheckboxMd5" checked={md5Checkbox} value="md5"
                onChange={() => setMd5Checkbox(!md5Checkbox)} />
            <label className="form-check-label" htmlFor="inlineCheckboxMd5">MD5</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="inlineCheckboxSha1" checked={sha1Checkbox} value="sha1"
                onChange={() => setSha1Checkbox(!sha1Checkbox)} />
            <label className="form-check-label" htmlFor="inlineCheckboxSha1">SHA-1</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="inlineCheckboxSha256" checked={sha256Checkbox} value="sha256"
                onChange={() => setSha256Checkbox(!sha256Checkbox)} />
            <label className="form-check-label" htmlFor="inlineCheckboxSha256">SHA-256</label>
          </div>
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

export default App;