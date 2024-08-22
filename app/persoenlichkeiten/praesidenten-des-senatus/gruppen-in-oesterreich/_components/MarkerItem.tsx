import { MarkerF, OverlayView } from "@react-google-maps/api"
import { useState } from "react"
import MarkerOverlay from "./MarkerOverlay"

const MarkerItem = ({ presidium }) => {
	const [selected, setSelected] = useState(null)

	return (
		<MarkerF onClick={() => setSelected(presidium)} position={presidium.location.coordinates}>
			{selected && (
				<OverlayView position={selected.location.coordinates} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
					<MarkerOverlay selected={selected} onClose={() => setSelected(null)} />
				</OverlayView>
			)}
		</MarkerF>
	)
}

export default MarkerItem
