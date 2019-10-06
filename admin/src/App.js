import React, { Component } from 'react';
import './css/App.scss';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/Navbar';
import Header from './components/Header';
import Slider from './components/Slider';

class App extends Component {
  state = {}

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Header />
        <Slider />
      </Router>
    );
  }
}

export default App;
