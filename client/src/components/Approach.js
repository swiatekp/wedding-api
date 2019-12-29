import React, { Component } from 'react';
import '../css/Approach.scss';
import { Switch, Route } from 'react-router-dom';
import ApproachMain from './ApproachMain.js';
import ApproachViewer from './ApproachViewer';
import '../css/Approach.scss'; //Contains styles for each Route
import config from '../config.json';

class Approach extends Component {
    state = {
        approachChurchTips: [],
        approachPartyTips: []
    }
    componentDidMount() {
        fetch(`${config.apiUrl}/api/approach-tips`)
            .then(tips => tips.json())
            .then(tips => {
                if (tips.error) {
                    throw new Error(tips.error)
                }
                else {
                    const approachChurchTips = tips.filter(tip => {
                        if (tip.category === "1") return true
                        else return false;
                    });
                    const approachPartyTips = tips.filter(tip => {
                        if (tip.category === "2") return true
                        else return false;
                    });
                    this.setState({ approachChurchTips, approachPartyTips });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    render() {
        return (
            <Switch>
                <Route exact={true} path="/approach/" component={ApproachMain}></Route>
                <Route path="/approach/church/" render={() => (<ApproachViewer showImage={this.props.showImage} tips={this.state.approachChurchTips} />)}></Route>
                <Route path="/approach/party" render={() => (<ApproachViewer showImage={this.props.showImage} tips={this.state.approachPartyTips} />)}></Route>
            </Switch>
        );
    }
}

export default Approach;