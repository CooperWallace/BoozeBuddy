import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import pages from '../pages/index';

export default class RouteManager extends Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' render={(routeProps) => (<pages.Home {...routeProps} />)} />
                    <Route exact path='/listing' render={(routeProps) => (<pages.StoreListing {...routeProps} />)} />
                </Switch>
            </BrowserRouter>
        );
    }
}
