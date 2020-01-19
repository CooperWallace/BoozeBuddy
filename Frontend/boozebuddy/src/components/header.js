import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import './components.css';


export default class BoozeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null
        }

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        //delete the token
        Cookies.remove('token');
        this.setState({
            token: null
        })
    }

    componentDidMount() {
        //check for a token cookie
        let token = Cookies.get('token')
        if (token) {
            this.setState({
                token: token
            })
        }
    }

    componentDidUpdate() {
        let token = Cookies.get('token')
        if (token && !this.state.token) {
            this.setState({
                token: token
            })
        }
    }

    render() {
        return (
            <Grid.Row style={{ width: this.props.width }} className="booze-header-container" verticalAlign="middle" columns={2}>
                <Grid.Column verticalAlign="middle">
                    <h1
                        onClick={() => { this.props.history.push("/") }}
                        className="booze-header-text">Booze Buddy</h1>
                </Grid.Column>
                <Grid.Column textAlign='right'>
                    {this.state.token == null ?
                        <h5
                            onClick={() => this.props.handleSignIn()}
                            className="booze-header-text-right">Sign in</h5> :
                        <h5
                            onClick={this.handleLogout}
                            className="booze-header-text-right"
                        >Sign out</h5>}
                </Grid.Column>
            </Grid.Row>
        )
    }
}