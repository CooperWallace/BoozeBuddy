import React, { Component } from 'react';
import { Grid, List } from 'semantic-ui-react';
import components from '../components/index';


export default class StoreListing extends Component {

    constructor(props) {
        super(props);
		this.state = {};
    }

	itemdetails (itemName) {
		return (
			<List.Item>{itemName}</List.Item>
		)
	}

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
						<h1>Store Listing Details</h1>
                    </Grid.Column>
                </Grid.Row>
				<Grid.Row>
                    <Grid.Column>
						Store Name
						Store Address
                    </Grid.Column>
                </Grid.Row>
				<Grid.Row>
                    <Grid.Column>
						<List>
							{this.itemdetails("Test")}
						</List>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }


}
