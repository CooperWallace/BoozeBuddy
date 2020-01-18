import React from "react"
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

export default class BoozeMap extends React.Component {
	constructor(props) {
		super();
		this.state = {
		}
	}

	render() {
		const position = [this.props.lat, this.props.lng];
		return (
			<Map style={{ width: this.props.width, height: this.props.height }} center={position} zoom={this.props.zoom}>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
				/>
				<Marker position={position}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
          			</Popup>
				</Marker>
			</Map>
		);
	}
}
