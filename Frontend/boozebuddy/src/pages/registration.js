import React, { Component } from 'react';
import { Grid, Segment, Form, Message } from 'semantic-ui-react';
import components from '../components/index'

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModalOpen: false,
            name: "",
            password: "",
            errorFields: []
        }
        this.handleSignInModalClose = this.handleSignInModalClose.bind(this);
        this.handleSignInModalOpen = this.handleSignInModalOpen.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSignInModalClose() {
        this.setState({
            loginModalOpen: false
        })
    }

    handleSignInModalOpen() {
        this.setState({
            loginModalOpen: true
        })
    }

    handleSubmit() {
        let fields = ["name", "password"]
        let errors = [];
        //lets check that the values are good
        fields.forEach((field) => {
            if (this.state[field] === "") {
                errors.push(field);
            }
        })

        this.setState({
            errorFields: errors
        })

        if (errors.length === 0) {
            //make post request to register
            fetch("http://localhost:8080/register", {
                method: "POST",
                body: JSON.stringify({
                    username: this.state.name,
                    password: this.state.password
                })
            })
                .then((res) => {
                    console.log(res)
                    if (res.ok) {
                        this.props.history.push("/");
                    } else {
                        console.error(res.status)
                    }
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }


    render() {
        return (
            <Grid>
                <components.BoozeHeader
                    handleSignIn={this.handleSignInModalOpen}
                    history={this.props.history}
                    width={this.state.width} />
                <Grid.Row>
                    <Grid.Column style={{ marginLeft: '65px', marginRight: '65px' }}>
                        <h4>Two fields and you're in!</h4>
                        <Form
                            as={Segment}>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    name="name"
                                    onChange={(e) => { this.handleInputChange(e) }}
                                    required
                                    error={this.state.errorFields.includes("name")}
                                    label="Username"
                                    placeholder="username..." />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    name="password"
                                    type="password"
                                    required
                                    onChange={(e) => { this.handleInputChange(e) }}
                                    error={this.state.errorFields.includes("password")}
                                    label="Password" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Button onClick={this.handleSubmit} content="Submit" primary></Form.Button>
                            </Form.Group>
                        </Form>
                        <Message negative hidden={this.state.errorFields.length === 0}>
                            <Message.Header>
                                Please fill out all required fields.
                            </Message.Header>
                        </Message>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}