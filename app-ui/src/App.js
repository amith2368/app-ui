import { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import BasicConnection from "./components/BasicConnection";

function App() {

  const [response, setResponse ] = useState({}); 

  useEffect(() => {
    fetch('/api/hello')
    .then(response => response.json())
    .then(data => {
      if(data) {
        setResponse(data.message);
        console.log(data.message);
      }
    })
  }, [])

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Message: {response}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <BasicConnection />
    </div>
  );
}

export default App;
