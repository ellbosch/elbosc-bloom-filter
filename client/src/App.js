import React, { useState, useEffect } from 'react';
import BloomFilter from './BloomFilter'

function App() {
  const [wordsList, setWordsList] = useState(null);

  // fetch list of words
  useEffect(() => {
    fetch('/words')
      .then(res => res.json())
      .then(
        (result) => {
          setWordsList(result.data)
        }
      )
  });

  return (
    <div>
      <h1>Hi</h1>
      <BloomFilter wordsList={wordsList} />
    </div>
  );
}

export default App;