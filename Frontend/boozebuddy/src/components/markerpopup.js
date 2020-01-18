import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';


export default class MarkerPopup extends Component {

    render() {
        return (
            <Grid textAlign="center">
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h5">{this.props.name}</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <p>{this.props.address.street}<br />{this.props.address.city}<br />{this.props.address.province}</p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <a href={"/listing/" + this.props.name}>Visit</a>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}