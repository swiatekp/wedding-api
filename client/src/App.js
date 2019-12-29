import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Header from './components/Header.js';
import Slider from './components/Slider.js';
import './css/Animation.scss';
import config from './config.json';

class App extends Component {
  state = {
    pageInfo: {
      pageTitle: '',
      weddingDate: null,

      brideName: '',
      brideMail: '',
      brideTel: '',

      groomName: '',
      groomMail: '',
      groomTel: '',

      landingPageText: '',
    },

  }

  componentDidMount() {
    //fetch the page info
    fetch(`${config.apiUrl}/page`)
      .then(pageInfo => pageInfo.json())
      .then(pageInfo => {
        if (pageInfo.error) {
          throw new Error(pageInfo.error)
        }
        else {
          this.setState(prevState => ({
            ...prevState,
            pageInfo: {
              ...pageInfo,
              weddingDate: new Date(pageInfo.weddingDate)
            }
          }));
          document.title = `${this.state.pageInfo.pageTitle} - ${this.convertDate(new Date(pageInfo.weddingDate))}`;
        }
      })
      .catch(err => {
        console.log(err);
      })
    //fetch approach tips here
  }
  convertDate = date => {
    let stringToReturn = '';
    if (date) {
      stringToReturn += date.getDate(); //add day to the string

      const month = date.getMonth();
      switch (month) {
        case 0:
          stringToReturn += " stycznia ";
          break;

        case 1:
          stringToReturn += " lutego ";
          break;

        case 2:
          stringToReturn += " marca ";
          break;

        case 3:
          stringToReturn += " kwietnia ";
          break;

        case 4:
          stringToReturn += " maja ";
          break;

        case 5:
          stringToReturn += " czerwca ";
          break;

        case 6:
          stringToReturn += " lipca ";
          break;

        case 7:
          stringToReturn += " sierpnia ";
          break;

        case 8:
          stringToReturn += " września ";
          break;

        case 9:
          stringToReturn += " października ";
          break;

        case 10:
          stringToReturn += " listopada ";
          break;

        case 11:
          stringToReturn += " grudnia ";
          break;

        default:
          stringToReturn = "Strona ślubna";
          break;
      }

      if (stringToReturn !== "Strona ślubna") {
        stringToReturn += `${date.getFullYear()} r.`
      }
    }
    return stringToReturn;
  }
  render() {
    const {
      pageTitle,
      weddingDate,

      brideName,
      brideMail,
      brideTel,

      groomName,
      groomMail,
      groomTel,

      landingpageText } = this.state.pageInfo;
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Header pageInfo={{ pageTitle, weddingDate: this.convertDate(weddingDate) }} />
        <Slider pageInfo={{ brideName, brideTel, brideMail, groomName, groomTel, groomMail, landingpageText }} />
      </Router>
    );
  }
}

export default App;
