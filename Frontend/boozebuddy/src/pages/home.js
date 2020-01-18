import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import components from '../components/index';

export default class Home extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(navigator.geolocation.getCurrentPosition((pos) => {
            console.log(pos)
        }))
    }

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <components.BoozeMap
                            width={"500px"}
                            height={"500px"}
                            lat={53.54}
                            lng={-113.49}
                            zoom={15} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}