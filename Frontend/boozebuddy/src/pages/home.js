import React, { Component } from 'react';
import { Grid, Modal, Button, Header } from 'semantic-ui-react';
import components from '../components/index';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                this.setState({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                })
            })
        }
    }

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <components.BoozeMap
                            width={"700px"}
                            height={"500px"}
                            lat={this.state.lat ? this.state.lat : 53.54}
                            lng={this.state.lng ? this.state.lng : -113.49}
                            markers={[
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
                        <Button onClick={() => { this.setState({ loginModalOpen: true }) }}>click me</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Modal
                            open={this.state.loginModalOpen}
                            closeOnDimmerClick={true}
                            onClose={() => { this.setState({ loginModalOpen: false }) }}
                        >
                            <Modal.Content>
                                <Grid textAlign="center">
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Header>Sign in</Header>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button primary>Login</Button>
                                <Button onClick={() => { this.setState({ loginModalOpen: false }) }} color="red">Cancel</Button>
                            </Modal.Actions>
                        </Modal>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
