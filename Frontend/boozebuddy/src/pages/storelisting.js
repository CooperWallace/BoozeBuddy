import React, { Component } from 'react';
import { Grid, List, Message, Input, Dropdown, Image, Segment, Button } from 'semantic-ui-react';
import components from '../components/index';
import '../components/components.css';

export default class StoreListing extends Component {

	constructor(props) {
		super(props);
		this.state = {
			listingData: []
		};

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
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);

		//get store info based off of id that is in the url
		fetch("http://localhost:8080/api/stores/" + this.props.match.params.storeID)
			.then((res) => {
				return res.json()
			})
			.then((data) => {
				this.setState({
					storeDetails: data
				}, () => {
					//now go get the entries for this store
					fetch("http://localhost:8080/api/stores/" + this.props.match.params.storeID + "/items")
						.then((res) => {
							return res.json()
						})
						.then((data) => {
							this.setState({
								listingData: data
							})
						})
						.catch((err) => {
							console.error(err)
						})
				})
			})
			.catch((err) => {
				console.error(err)
			})
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	createItemsList() {
		let items = [];

		//foreach the state object that will come from the api for listings at this store
		this.state.listingData.forEach((val, index) => {
			let imageSource;

			if (val.category === "beer") {
				imageSource = "beer.png"
			} else if (val.category === "vodka") {
				imageSource = "vodka.png"
			} else if (val.category === "rum") {
				imageSource = "rum.png"
			} else if (val.category === "tequila") {
				imageSource = "tequila.png"
			} //TODO : add more types

			items.push(
				<List.Item key={index}>
					<Segment className="listing-segment">
						<Grid verticalAlign="middle">
							<Grid.Row columns={3}>
								<Grid.Column width={1}>
									<Image avatar src={process.env.PUBLIC_URL + "/" + imageSource} />
								</Grid.Column>
								<Grid.Column width={8}>
									{val.name}
								</Grid.Column>
								<Grid.Column textAlign="right">
									${val.price}
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Segment>
				</List.Item>
			)
		})
		return items;
	}

	render() {
		if (this.state.width && this.state.height && this.state.storeDetails) {
			//TODO add sorting
			const options = [
				{ key: 1, text: 'Price', value: 1 },
				{ key: 2, text: 'Recently Added', value: 2 },
				{ key: 3, text: 'Best Value', value: 3 },
			]

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
									<Message.Item><b>Store Name: </b>{this.state.storeDetails.Name}</Message.Item>
									<Message.Item><b>Store Address: </b>{this.state.storeDetails.address}</Message.Item>
								</Message.List>
							</Message>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="store-listing-container" columns={3}>
						<Grid.Column>
							<h4>Category</h4>
							<Input placeholder="Category" list="categories" />
							<datalist id="categories">
								<option value="Beer" />
								<option value="Vodka" />
								<option value="Rum" />
								<option value="Tequila" />
							</datalist>
						</Grid.Column>
						<Grid.Column>
							<h4>Sort by</h4>
							<Dropdown clearable options={options} selection />
						</Grid.Column>
						<Grid.Column>
							<Button style={{ marginTop: '35px' }} color="orange">Add Item</Button>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="store-listing-container">
						<Grid.Column>
							<List size={"massive"}>
								{this.createItemsList()}
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
