import React, { Component } from 'react';
import { Grid, List, Message} from 'semantic-ui-react';
import components from '../components/index';

import utility from '../addressUtility.js';

export default class StoreListing extends Component {

    constructor(props) {
        super(props);
		this.state = {};
    }

	componentDidMount() {
		utility.LatLonToAddress("9927 84 Ave NW");


	}

	itemdetails(itemName) {
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
						<Message>
						<Message.Header>Store Information</Message.Header>
						<Message.List>
						<Message.Item>Store Name: {this.props.match.params.storename}</Message.Item>
						<Message.Item>Store Address</Message.Item>
						</Message.List>
						</Message>
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
