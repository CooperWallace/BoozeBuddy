import React from 'react';
import logo from './logo.svg';
import BoozeMap from './components/map';
import { Grid } from 'semantic-ui-react';
import './App.css';

export default class App extends React.Component {
	render() {
		return (
			<Grid>
				<Grid.Row>
					<Grid.Column>
						<BoozeMap width={"500px"} height={"500px"} lat={53.54} lng={-113.49} zoom={15} />
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}

