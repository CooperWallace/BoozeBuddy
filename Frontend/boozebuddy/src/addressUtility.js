import MQKey from './mapquest.json';

function LatLonToAddress(address) {
	fetch("http://open.mapquestapi.com/geocoding/v1/address?key=" +
			MQKey.key + "&location=" + address.split(" ").join( "+")
	).then(results => {return results.json()})
		.then(data => {console.log(data.results[0].locations[0].latLng)});
}

let utility = { LatLonToAddress };
export default utility;
