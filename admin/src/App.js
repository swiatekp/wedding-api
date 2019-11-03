import React, { Component } from 'react';
import './css/App.scss';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/Navbar';
import Header from './components/Header';
import Slider from './components/Slider';


class App extends Component {
  state = {};

  componentDidMount() {
    const bearer = window.location.search.substring(8);
    this.setState({ bearer });
  }
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL + '/admin'}>
        <Navbar bearer={this.state.bearer} />
        <Header />
        <Slider bearer={this.state.bearer} />
      </Router>
    );
  }
}

export default App;
