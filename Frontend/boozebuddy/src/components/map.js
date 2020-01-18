import React from "react"
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

export default class BoozeMap extends React.Component {
	constructor(props) {
		super();
		this.state = {
		}
	}

	componentDidMount() {
		//check for props and apply them to map
		this.setState({
			lat: this.props.lat,
			lng: this.props.lng,
			zoom: this.props.zoom,
			width: this.props.width,
			height: this.props.height
		})
	}

	render() {
		const position = [this.state.lat, this.state.lng];
		return (
			<Map style={{ width: this.state.width, height: this.state.height }} center={position} zoom={this.state.zoom}>
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
