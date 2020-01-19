import React, { Component } from 'react';
import { Grid, List, Message, Modal, Form, Button } from 'semantic-ui-react';
import components from '../components/index';
import utility from '../addressUtility.js';
import '../components/components.css';

export default class StoreListing extends Component {

	constructor(props) {
		super(props);
		this.state = {};

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleSignInModalClose = this.handleSignInModalClose.bind(this);
		this.handleSignInModalOpen = this.handleSignInModalOpen.bind(this);
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
		utility.LatLonToAddress("9927 84 Ave NW");
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	itemdetails(itemName) {
		return (
			<List.Item>{itemName}</List.Item>
		)
	}

	render() {
		if (this.state.width && this.state.height) {
			return (
				<Grid>
					<components.BoozeHeader handleSignIn={this.handleSignInModalOpen} history={this.props.history} width={this.state.width} />
					<Grid.Row className="store-listing-container">
						<Grid.Column>
							<h1>Store Listing Details</h1>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="store-listing-container">
						<Grid.Column>
							<Message>
								<Message.Header>Store Information</Message.Header>
								<Message.List>
									<Message.Item>Store Name: {this.props.match.params.storename}</Message.Item>
									<Message.Item>Store Address</Message.Item>
								</Message.List>
							</Message>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="store-listing-container">
						<Grid.Column>
							<List>
								{this.itemdetails("Test")}
							</List>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							<components.LoginModal
								active={this.state.loginModalOpen}
								handleClose={this.handleSignInModalClose} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			)
		} else {
			return (
				<Grid>
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
