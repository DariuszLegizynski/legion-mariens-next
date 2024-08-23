import { Marker, Popup } from "react-leaflet"
import MarkerOverlay from "./MarkerOverlay"
import { Icon } from "leaflet"

const MarkerItem = ({ presidium }) => {
	const { lat, lng } = presidium.location.coordinates

	const lmIcon = new Icon({
		iconUrl: "/images/Standarte_LM_bg_white.svg",
		iconSize: [40, 40],
		iconAnchor: [16, 32],
		popupAnchor: [0, -32],
	})

	console.log(presidium)

	return (
		<Marker position={[lat, lng]} icon={lmIcon}>
			<Popup>
				<MarkerOverlay presidium={presidium} />
			</Popup>
		</Marker>
	)
}

export default MarkerItem
