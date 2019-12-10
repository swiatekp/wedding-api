import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Page from './Page';
import Guests from './Guests';
import EditGuest from './EditGuest';
import Approach from './Approach';
import EditApproach from './EditApproach';
import Account from './Account';
import Logout from './Logout';
import NotFound from './NotFound';

import '../css/Slider.scss';

class Slider extends Component {
    state = {}

    bearer = window.location.search.substring(8);

    render = () => {
        return (
            <main>
                <Switch>
                    <Route path="/" exact render={() => {
                        //Use this notation in order to pass props
                        const component = React.createElement(Page, {
                            bearer: this.bearer
                        })
                        return component;
                    }}></Route>
                    <Route path="/guests/edit/:id/" component={EditGuest}></Route>
                    <Route path="/guests" render={() => {
                        const component = React.createElement(Guests, {
                            bearer: this.bearer
                        })
                        return component;
                    }}></Route>
                    <Route path="/approach/edit/:id/" component={EditApproach}></Route>
                    <Route path="/approach" render={() => {
                        const component = React.createElement(Approach, {
                            bearer: this.bearer
                        })
                        return component;
                    }}></Route>
                    <Route path="/account" render={() => {
                        const component = React.createElement(Account, {
                            bearer: this.bearer
                        })
                        return component;
                    }}></Route>
                    <Route path="/logout" render={() => {
                        const component = React.createElement(Logout, {
                            bearer: this.bearer
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