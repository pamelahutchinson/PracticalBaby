import React, { Component } from 'react';
import './App.css';
import HomePage from './Components/HomePage.js';

class App extends Component {
  constructor() {
    super();
    this.state = {

    }
  }
  render() {
    return (
      <div className="App">
        <HomePage />
      </div>
    )
  }
}

export default App;