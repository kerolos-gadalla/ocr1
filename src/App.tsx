import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useWasm } from './useWasm';


function App() {
  const { loaded, instance, error } = useWasm('my-wasm.wasm');
  return (
    <div className="App">
      {loaded &&
        instance.exports.addString('hello', 'wasm')
      }
      {error && error.message}

    </div>
  );
}

export default App;
