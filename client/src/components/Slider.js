import React, { Component } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import SwipeableRoutes from "react-swipeable-routes";
import '../css/Slider.scss';
import pagelist from '../pagelist.js';
import FormError from './FormError.js';
import ShowImage from './ShowImage.js';

class Slider extends Component {
    state = {
        errorPrompt: "",
        errorPromptLocked: false, //prevent the prompt from being set multiple times
        imagePath: null
    }
    //error prompt setter - used by the Confirmation component
    //Had to be moved here because of problems with position:fixed inside SwipeableRoutes
    setErrorPrompt = (errorPrompt) => {
        if (!this.state.errorPromptLocked) {
            this.setState({
                errorPrompt,
                errorPromptLocked: true
            })
            setTimeout(() => {
                this.setState({
                    errorPrompt: "",
                    errorPromptLocked: false
                });
            }, 2500)
        }
    }
    //Shows an image - if state.imagePath is not null, ShowImage component is shown
    showImage = (imagePath) => {
        this.setState({ imagePath })
    }
    hideImage = () => {
        this.setState({ imagePath: null })
    }
    render = () => {
        const list = pagelist(); //assign pagelist() result to a variable to avoid executing it multiple times 

        //Map the page list to create the slider dots
        const dots = list.map((dot, key) => (
            <NavLink key={key} exact={dot.exact} className="slider-dot" to={dot.path}>{dot.pagename}</NavLink>
        ));

        //Map the page list to create the slider content
        const routes = list.map((route, key) => (
            <Route key={key} path={route.path} render={() => {
                const component = React.createElement(route.component, {
                    key,
                    setErrorPrompt: this.setErrorPrompt,
                    showImage: this.showImage,
                    pageInfo: this.props.pageInfo
                })
                return component;
                //The react must be written without JSX because the Component name is stored in a variable
            }} />
        ));
        //Back and forward buttons for the sliders
        //Switch and Route are used because the "to" prop has to change every time the page changes
        const sliderButtonBack = list.map((route, key) => {
            let index = null;
            if (route.id === 0) {
                index = list.length - 1;
            }
            else {
                index = route.id - 1;
            }
            return (
                <Route exact={route.exact} key={key} path={route.path} render={() => (
                    <NavLink className="slider-button" to={list[index].path}>&lt;</NavLink>
                )} />
            )
        });
        const sliderButtonForward = list.map((route, key) => {
            let index = null;
            if (route.id === list.length - 1) {
                index = 0;
            }
            else {
                index = route.id + 1;
            }
            return (
                <Route exact={route.exact} key={key} path={route.path} render={() => (
                    <NavLink className="slider-button" to={list[index].path}>&gt;</NavLink>
                )} />
            )
        });
        return (
            <main>
                {
                    this.state.errorPrompt === "" ? null : <FormError error={this.state.errorPrompt} />
                }
                {
                    this.state.imagePath ? <ShowImage hideImage={this.hideImage} path={this.state.imagePath} /> : null
                }
                <Switch>
                    {sliderButtonBack}
                </Switch>
                <article className="main-content">
                    <SwipeableRoutes>
                        {routes}
                    </SwipeableRoutes>
                    <div className="dots-container">
                        {dots}
                    </div>
                </article>
                <Switch>
                    {sliderButtonForward}
                </Switch>
            </main>
        );

    }
}
export default Slider;