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
    render = () => {
        return (
            <main>
                <Switch>
                    <Route path="/" exact component={Page}></Route>
                    <Route path="/guests/edit/:id/" component={EditGuest}></Route>
                    <Route path="/guests" component={Guests}></Route>
                    <Route path="/approach/edit/:id/" component={EditApproach}></Route>
                    <Route path="/approach" component={Approach}></Route>
                    <Route path="/account" component={Account}></Route>
                    <Route path="/logout" component={Logout}></Route>
                    <Route path="*" component={NotFound}></Route>
                </Switch>
            </main>
        );
    }
}

export default Slider;