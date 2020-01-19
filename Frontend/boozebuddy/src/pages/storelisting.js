import React, { Component } from 'react';
import { Grid, List, Message, Input, Dropdown, Image, Segment, Button, Form, Modal } from 'semantic-ui-react';
import components from '../components/index';
import Cookies from 'js-cookie';
import '../components/components.css';

export default class StoreListing extends Component {

	constructor(props) {
		super(props);
		this.state = {
			listingData: [],
			errorList: [],
			addModalOpen: false
		};

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleSignInModalClose = this.handleSignInModalClose.bind(this);
		this.handleSignInModalOpen = this.handleSignInModalOpen.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.handleAddSubmit = this.handleAddSubmit.bind(this);
		this.handleAddModalOpen = this.handleAddModalOpen.bind(this);
		this.handleAddModalClose = this.handleAddModalClose.bind(this);
		this.getStoreDetails = this.getStoreDetails.bind(this);
		this.sortListings = this.sortListings.bind(this);
	}

	handleDropDownChange(e, data, name) {
		this.setState({
			[name]: data.value
		})
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

	handleAddSubmit() {
		//check values
		let fields = ["name", "category", "price"]
		let errors = [];
		//lets check that the values are good
		fields.forEach((field) => {
			if (!this.state[field]) {
				errors.push(field);
			}
		})

		if (errors.length === 0) {
			console.log("here")
		}

		let token = Cookies.get('token');

		//now post to the api
		fetch("http://localhost:8080/api/stores/" + this.props.match.params.storeID + "/items", {
			method: "POST",
			headers: {
				'Authorization': token,
			},
			body: JSON.stringify({
				name: this.state.name,
				category: this.state.category,
				price: parseFloat(this.state.price)
			})
		})
			.then((res) => {
				if (!res.ok) {
					console.error("Response not ok!", res)
				} else {
					//close the modal && reset the state
					this.setState({
						price: "",
						name: "",
						category: "",
						addModalOpen: false
					}, () => {
						this.getStoreDetails()
					})
				}
			})
			.catch((err) => {
				console.error(err)
			})
	}

	getStoreDetails() {
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

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		this.getStoreDetails();

	}

	handleAddModalOpen() {
		//check if they're logged in or not
		let token = Cookies.get('token');
		if (token) {
			this.setState({
				addModalOpen: true
			})
		} else {
			this.handleSignInModalOpen(); //open the sign in modal
		}
	}

	handleAddModalClose() {
		this.setState({
			addModalOpen: false
		})
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	sortListings(e, data) {
		let copyData = [...this.state.listingData]

		if (data.value === 2) {
			copyData.sort((a, b) => {
				let aDate = new Date(a.timestamp);
				let bDate = new Date(b.timestamp);

				return aDate - bDate;
			})
			this.setState({
				listingData: copyData
			})

		} else if (data.value === 1) {
			copyData.sort((a, b) => {
				return a.price - b.price
			})

			this.setState({
				listingData: copyData
			})

		}
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
			} else if (val.category === "gin") {
				imageSource = "gin.png"
			} else if (val.category === "whiskey") {
				imageSource = "whiskey.png"
			}

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
				{ key: 2, text: 'Recently Added', value: 2 }
			]

			const categories = [
				{ key: 1, text: 'Beer', value: 'beer' },
				{ key: 2, text: 'Rum', value: 'rum' },
				{ key: 3, text: 'Vodka', value: 'vodka' },
				{ key: 4, text: 'Tequila', value: 'tequila' },
				{ key: 5, text: 'Whiskey', value: 'whiskey' },
				{ key: 6, text: 'Gin', value: 'gin' }
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
							<h4>Sort by</h4>
							<Dropdown onChange={(e, data) => this.sortListings(e, data)} clearable options={options} selection />
						</Grid.Column>
						<Grid.Column>
							<Button onClick={this.handleAddModalOpen} style={{ marginTop: '35px' }} color="orange">Add Item</Button>
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
							<Modal
								closeOnDimmerClick={true}
								size="tiny"
								onOpen={this.handleAddModalOpen}
								onClose={this.handleAddModalClose}
								open={this.state.addModalOpen}>
								<Modal.Header>Add new listing</Modal.Header>
								<Modal.Content>
									<Form >
										<Form.Group widths="equal">
											<Form.Input
												name="name"
												placeholder="Heineken"
												label="Name"
												required
												error={this.state.errorList.includes("name")}
												onChange={(e) => { this.handleInputChange(e) }} />
										</Form.Group>
										<Form.Group widths="equal">
											<Form.Dropdown
												name="category"
												placeholder="Beer"
												label="Category"
												fluid selection
												options={categories}
												error={this.state.errorList.includes("category")}
												required
												onChange={(e, d) => { this.handleDropDownChange(e, d, "category") }} />
										</Form.Group>
										<Form.Group widths="equal">
											<Form.Input
												name="price"
												type="number"
												placeholder="25"
												label="Price"
												error={this.state.errorList.includes("price")}
												required
												onChange={(e) => { this.handleInputChange(e) }}></Form.Input>
										</Form.Group>
										<Form.Group>
											<Form.Button onClick={this.handleAddSubmit} color="orange">Submit</Form.Button>
										</Form.Group>
									</Form>
								</Modal.Content>
							</Modal>
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
