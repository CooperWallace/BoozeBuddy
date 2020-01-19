import React, { Component } from 'react';
import { Grid, Search, Button } from 'semantic-ui-react';
import _ from 'lodash';
import components from '../components/index';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: false,
            searchLoading: false,
            searchResults: [],
            searchValue: "",
            debug: true
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

    handleSearchChange = (e, { value }) => {

        let source = [
            {
                "title": "Johns, Goodwin and Ullrich",
                "description": "Reduced hybrid model",
                "image": "https://s3.amazonaws.com/uifaces/faces/twitter/chris_witko/128.jpg",
                "price": "$46.38"
            },
            {
                "title": "Lemke, Beer and Marvin",
                "description": "Object-based optimal moderator",
                "image": "https://s3.amazonaws.com/uifaces/faces/twitter/giancarlon/128.jpg",
                "price": "$32.76"
            },
            {
                "title": "Senger - Kling",
                "description": "De-engineered responsive middleware",
                "image": "https://s3.amazonaws.com/uifaces/faces/twitter/carlosm/128.jpg",
                "price": "$51.72"
            },
            {
                "title": "Graham Group",
                "description": "Cross-platform optimal flexibility",
                "image": "https://s3.amazonaws.com/uifaces/faces/twitter/soffes/128.jpg",
                "price": "$8.57"
            },
            {
                "title": "Mills Group",
                "description": "Fundamental homogeneous projection",
                "image": "https://s3.amazonaws.com/uifaces/faces/twitter/tur8le/128.jpg",
                "price": "$85.26"
            }
        ]

        this.setState({ isLoading: true, searchValue: value })

        setTimeout(() => {
            if (this.state.searchValue.length < 1) return this.setState({
                searchLoading: false,
                searchResults: [],
                searchValue: "",
            })

            const re = new RegExp(_.escapeRegExp(this.state.searchValue), 'i')
            const isMatch = (result) => re.test(result.title)

            this.setState({
                isLoading: false,
                results: _.filter(source, isMatch),
            })
        }, 300)
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    componentDidMount() {
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
                if (!this.state.debug) {
                    this.handleSignInModalOpen()
                }

            }, 15000)
        }
    }

    render() {

        if (this.state.height && this.state.width) {
            return (
                <Grid>
                    <components.BoozeHeader
                        handleSignIn={this.handleSignInModalOpen}
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
                            <components.LoginModal
                                active={this.state.loginModalOpen}
                                handleClose={this.handleSignInModalClose}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column textAlign='center'>
                            <Search
                                loading={this.state.searchLoading}
                                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                                    leading: true
                                })}
                                results={this.state.results}
                                value={this.state.searchValue}
                            />
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
