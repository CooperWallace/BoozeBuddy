import React, { Component } from 'react';
import { Modal, Form } from 'semantic-ui-react';
import Cookies from 'js-cookie';

export default class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorFields: [],
            username: "",
            password: ""
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLogin() {
        //fire a post here to login

        fetch("http://localhost:8080/login", {
            method: "POST",
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
            .then((res) => {
                console.log(res)
                return res.json()
            })
            .then((data) => {
                //create a cookie for the jwt token
                Cookies.set('token', data.jwt, { expires: 1 })
                this.props.handleClose();
            })
            .catch((err) => {
                console.error(err)
            })
    }

    render() {

        return (
            <Modal
                size="tiny"
                open={this.props.active}
                closeOnDimmerClick={true}
                onClose={() => { this.props.handleClose() }}>
                <Modal.Header>Please sign in!</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input
                                name="username"
                                onChange={(e) => { this.handleInputChange(e) }}
                                required
                                label="Username"
                                placeholder="username..." />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input
                                name="password"
                                type="password"
                                required
                                onChange={(e) => { this.handleInputChange(e) }}
                                label="Password" />
                        </Form.Group>
                        <h5>Not a member? <a href="/register">Sign up here!</a></h5>
                        <Form.Group>
                            <Form.Button onClick={this.handleLogin} content="Submit" color="orange"></Form.Button>
                        </Form.Group>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}