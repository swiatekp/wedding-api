import React, { Component } from 'react';
import './css/App.scss';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/Navbar';
import Header from './components/Header';
import Slider from './components/Slider';


class App extends Component {
  state = {};
  componentDidMount() {
    console.log(document.cookie);
  }
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL + '/admin'}>
        <Navbar />
        <Header />
        <Slider />
      </Router>
    );
  }
}

export default App;
