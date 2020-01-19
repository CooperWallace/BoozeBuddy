import React, { Component } from 'react';
import { Grid, Modal, Button, Form } from 'semantic-ui-react';
import components from '../components/index';
import utility from '../addressUtility.js';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: false
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleSignIn() {
        this.setState({
            loginModalOpen: true
        });
    }

    componentDidMount() {
		this.getStoreAddresses();

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                this.setState({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                })
            })
        }

        //add event for if the user isnt logged in we will bug them in x seconds
        if (!this.state.userLoggedIn) {
            setTimeout(() => {
                this.setState({
                    loginModalOpen: true
                })
            }, 3000)
        }
    }

	getStoreAddresses() {
		let info = [];

		fetch("http://localhost:8080/api/stores")
			.then(results => {return results.json()})
			.then(data => {
				data.forEach( elem => {
					let lngLat = utility.LatLonToAddress(elem.address.split(",")[0]);
					lngLat.then( data => {
						info.push({
							name: elem.Name,
							address: elem.address.split(",")[0],
							lat: data.lat,
							lng: data.lng
						})
					});
				})
			}).then( this.setState({ storePositions: info }) )
			.then(console.log(this.state.storePositions));
	}

    render() {

        if (this.state.height && this.state.width) {
            return (
                <Grid>
                    <components.BoozeHeader
                        handleSignIn={this.handleSignIn}
                        history={this.props.history}
                        width={this.state.width} />
                    <Grid.Row>
                        <Grid.Column>
                            <components.BoozeMap
                                width={this.state.width / 2}
                                height={this.state.height / 2}
                                lat={this.state.lat ? this.state.lat : 53.54}
                                lng={this.state.lng ? this.state.lng : -113.49}
                                markers={[
                                    //sample data from the api
                                    {
                                        name: "Test marker 1",
                                        address: {
                                            street: "5514 55st NW",
                                            city: "Edmonton",
                                            province: "Alberta"
                                        },
                                        position: [53.76, -113.49]
                                    },
                                    {
                                        name: "Test marker 2",
                                        address: {
                                            street: "5514 55st NW",
                                            city: "Edmonton",
                                            province: "Alberta"
                                        },
                                        position: [53.40, -113.13]
                                    }
                                ]}
                                zoom={10} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Modal
                                size="tiny"
                                open={this.state.loginModalOpen}
                                closeOnDimmerClick={true}
                                onClose={() => { this.setState({ loginModalOpen: false }) }}
                            >
                                <Modal.Content>
                                    <Form>
                                        <Form.Field>
                                            <label>Username</label>
                                            <input placeholder="username..." />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Password</label>
                                            <input type="password" />
                                        </Form.Field>
                                        <Button type="submit" primary>Login</Button>
                                        <Button onClick={() => { this.setState({ loginModalOpen: false }) }} color="red">Cancel</Button>
                                    </Form>
                                </Modal.Content>
                            </Modal>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        } else {
            return (
                <Grid textAlign="center">
                    <Grid.Row>
                        <Grid.Column>
                            Loading
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
    }
}
