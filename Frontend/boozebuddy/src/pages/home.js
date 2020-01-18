import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
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
				console.log(this.state.lon);
			})
		}
    }

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <components.BoozeMap
                            width={"500px"}
                            height={"500px"}
                            lat={this.state.lat ? this.state.lat : -53.54}
                            lng={this.state.lng ? this.state.lng : -113.49}
                            zoom={15} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
