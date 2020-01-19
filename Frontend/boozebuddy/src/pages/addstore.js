import React, { Component } from 'react';
import { Grid, Form, Message, Segment } from 'semantic-ui-react';
import components from '../components/index';

export default class AddStore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginModalOpen: false,
            errorFields: [],
            name: "",
            street: "",
            city: "",
            province: "",
            postcode: ""
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSignInModalClose = this.handleSignInModalClose.bind(this);
        this.handleSignInModalOpen = this.handleSignInModalOpen.bind(this);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFormSubmit() {
        let fields = ["name", "street", "city", "province", "postcode"]
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
            //do the post request as they met the requirements
            fetch("http://localhost:8080/api/stores", {
                method: "POST",
                body: JSON.stringify({
                    name: this.state.name,
                    address: this.state.street + ", " + this.state.city + ", " + this.state.province + ", " + this.state.postcode
                })
            })
                .then((res) => {
                    console.log(res)
                    if (res.ok) {
                        //go back to main page
                        this.props.history.push("/");
                    }
                })
                .catch((err) => {
                    console.error(err)
                })
        }
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

    componentDidMount() {
        //TODO check if the user is signed in or not, if not we make them sign in

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
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
                        <h4>Tell us where you get drinks!</h4>
                        <Form
                            as={Segment}>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    name="name"
                                    onChange={(e) => { this.handleInputChange(e) }}
                                    required
                                    error={this.state.errorFields.includes("name")}
                                    label="Store Name"
                                    placeholder="Liquor store..." />
                            </Form.Group>
                            <h4>Address</h4>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    name="street"
                                    required
                                    onChange={(e) => { this.handleInputChange(e) }}
                                    error={this.state.errorFields.includes("street")}
                                    label="Street" />
                                <Form.Input
                                    name="city"
                                    required
                                    onChange={(e) => { this.handleInputChange(e) }}
                                    error={this.state.errorFields.includes("city")}
                                    label="City" />
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Form.Input
                                    name="province"
                                    required
                                    onChange={(e) => { this.handleInputChange(e) }}
                                    error={this.state.errorFields.includes("province")}
                                    label="Province" />
                                <Form.Input
                                    name="postcode"
                                    required
                                    onChange={(e) => { this.handleInputChange(e) }}
                                    error={this.state.errorFields.includes("postcode")}
                                    label="Postal Code" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Button onClick={this.handleFormSubmit} content="Submit" primary></Form.Button>
                            </Form.Group>
                        </Form>
                        <Message negative hidden={this.state.errorFields.length === 0}>
                            <Message.Header>
                                Please fill out all required fields.
                            </Message.Header>
                        </Message>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <components.LoginModal
                            active={this.state.loginModalOpen}
                            handleClose={this.handleSignInModalClose}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}