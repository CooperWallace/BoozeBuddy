import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react';
import './components.css';

export default class BoozeHeader extends Component {
    render() {
        return (
            <Grid.Row style={{ width: this.props.width }} className="booze-header-container" verticalAlign="middle" columns={2}>
                <Grid.Column verticalAlign="middle">
                    <h1
                        onClick={() => { this.props.history.push("/") }}
                        className="booze-header-text">Booze Buddy</h1>
                </Grid.Column>
                <Grid.Column textAlign='right'>
                    <h5 
                    onClick={() => this.props.handleSignIn()}
                    className="booze-header-text-right">Sign in</h5>
                </Grid.Column>
            </Grid.Row>
        )
    }
}