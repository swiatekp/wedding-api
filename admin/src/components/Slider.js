import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Page from './Page';
import Guests from './Guests';
import Approach from './Approach';
import Account from './Account';
import NotFound from './NotFound';

import '../css/Slider.scss';

class Slider extends Component {
    state = {}

    componentDidMount() {
        const bearer = window.location.search.substring(8);
        this.setState({ bearer });
    }

    render = () => {
        return (
            <main>
                <Switch>
                    <Route path="/" exact render={() => {
                        //Use this notation in order to pass props
                        const component = React.createElement(Page, {
                            bearer: this.state.bearer
                        })
                        return component;
                    }}></Route>
                    <Route path="/guests" render={() => {
                        const component = React.createElement(Guests, {
                            bearer: this.state.bearer
                        })
                        return component;
                    }}></Route>
                    <Route path="/approach" render={() => {
                        const component = React.createElement(Approach, {
                            bearer: this.state.bearer
                        })
                        return component;
                    }}></Route>
                    <Route path="/account" render={() => {
                        const component = React.createElement(Account, {
                            bearer: this.state.bearer
                        })
                        return component;
                    }}></Route>
                    <Route path="*" component={NotFound}></Route>
                </Switch>
            </main>
        );
    }
}

export default Slider;