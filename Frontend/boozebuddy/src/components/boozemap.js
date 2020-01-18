import React from "react"
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import components from './index';

export default class BoozeMap extends React.Component {
	constructor(props) {
		super();
	}

	renderMarkers() {
		let markers = [];

		if (this.props.markers && this.props.markers.length > 0) {
			this.props.markers.forEach((marker, i) => {
				//takes a position argument [lat, long] for displaying to map
				markers.push(
					<Marker position={marker.position} key={i} >
						<Popup>
							<components.MarkerPopup name={marker.name} address={marker.address} />
						</Popup>
					</Marker>
				)
			})

			return markers;
		}


	}

	render() {
		const position = [this.props.lat, this.props.lng];
		return (
			<Map
				style={{ width: this.props.width, height: this.props.height, marginLeft: 'auto', marginRight: 'auto' }}
				center={position}
				zoom={this.props.zoom}>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
				/>
				{this.renderMarkers()}
			</Map>
		);
	}
}
