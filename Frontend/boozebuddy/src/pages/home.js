import React, { Component } from 'react';
import { Grid, Search } from 'semantic-ui-react';
import _ from 'lodash';
import components from '../components/index';
import utility from '../addressUtility.js';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: false,
            searchLoading: false,
            searchResults: [],
            searchValue: "",
            storeData: [],
            fullStoreData: [],
            focusPoint: null,
            zoom: 10, //might change
            debug: true
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleSignInModalClose = this.handleSignInModalClose.bind(this);
        this.handleSignInModalOpen = this.handleSignInModalOpen.bind(this);
    }

    clearMapFocus() {
        this.setState({
            focusPoint: null
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

    handleSearchChange = (e, { value }) => {

        //create source values from state
        let source = [];

        this.state.fullStoreData.forEach((val) => {
            source.push({
                title: val.Name,
                description: val.address,
                id: val.storeID,
                lat: val.lat,
                lng: val.lng
            })
        })

        this.setState({ isLoading: true, searchValue: value })

        setTimeout(() => {
            if (this.state.searchValue.length < 1) return this.setState({
                searchLoading: false,
                searchResults: [],
                searchValue: "",
            })

            const re = new RegExp(_.escapeRegExp(this.state.searchValue), 'i')
            let isMatch = (result) => re.test(result.title)

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
                if (!this.state.debug) {
                    this.handleSignInModalOpen()
                }

            }, 15000)
        }
    }

    getStoreAddresses() {
        fetch("http://localhost:8080/api/stores")
            .then(results => { return results.json() })
            .then(data => {
                this.setState({
                    storeData: data
                }, () => {
                    Promise.all(this.state.storeData.map((elem) => {
                        return utility.LatLonToAddress(elem.address.split(",")[0])
                    })).then((data) => {
                        let vals = [];
                        for (let i = 0; i < this.state.storeData.length; i++) {
                            vals.push({
                                ...this.state.storeData[i], ...data[i]
                            })
                        }
                        this.setState({
                            fullStoreData: vals
                        })
                    })
                })
            })
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
                                markers={this.state.fullStoreData}
                                focus={this.state.focusPoint}
                                zoom={this.state.zoom} />
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
                                onResultSelect={(e, data) => {
                                    //set the maps zoom on the object in question
                                    this.setState({
                                        lat: data.result.lat,
                                        lng: data.result.lng,
                                        zoom: this.state.zoom <= 12 ? 12 : this.state.zoom
                                    })
                                }}
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
