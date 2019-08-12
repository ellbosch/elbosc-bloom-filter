import React, { useState } from 'react';
import Controls from './controls.js';
import QueryResult from './query-result.js';

function App() {
  const [queryString, setQueryString] = useState("");

  return (
    <div className="container">
      <h1 className="text-center" id="header-main">Bloom Filter</h1>
      <p className="text-center"><em>Spellchecker with a customizable <a href="https://en.wikipedia.org/wiki/Bloom_filter">bloom filter</a>.</em></p>
      <input type="text" className="form-control" placeholder="Look up word in bloom filter" aria-label="Search word"
        aria-describedby="button-search" value={queryString} onChange={e => setQueryString(e.target.value)} />
      <br />
      <Controls size={8} setWordLookUpQuery={setQueryString} algorithms={{ 'MD5': true, 'SHA-1': true, 'SHA-256': true }} />
      <QueryResult query={queryString} />
    </div>
  );
}

export default App;