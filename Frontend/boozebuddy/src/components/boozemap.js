import React from "react"
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import components from './index';
import './components.css';

export default class BoozeMap extends React.Component {
	constructor(props) {
		super();
		this.mapRef = React.createRef()
		this.state = {
			val: null
		}
	}

	renderMarkers() {
		let markers = [];
		if (this.props.markers && this.props.markers.length > 0) {
			this.props.markers.forEach((marker, i) => {

				//takes a position argument [lat, long] for displaying to map
				markers.push(
					<Marker position={[marker.lat, marker.lng]} key={i} >
						<Popup>
							<components.MarkerPopup name={marker.Name} address={marker.address} storeID={marker.storeID} />
						</Popup>
					</Marker>
				)
			})
			return markers;
		}
	}

	componentDidUpdate(oldProps, oldState) {
		//check if the long & lat changed and open the popup there if that is the case
		if (oldProps.lat !== this.props.lat || oldProps.lng !== this.props.lng) {
			this.mapRef.current.leafletElement.eachLayer((layer) => {
				if (layer.options) {
					if (layer.options.position && layer.options.position[0] === this.props.lat) {
						layer.openPopup([this.props.lat, this.props.lng])
					}
				}
			})
		}
	}

	render() {
		const position = [this.props.lat, this.props.lng];
		return (
			<Map
				className={"boozemap"}
				ref={this.mapRef}
				animate={true}
				useFlyTo={true}
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
