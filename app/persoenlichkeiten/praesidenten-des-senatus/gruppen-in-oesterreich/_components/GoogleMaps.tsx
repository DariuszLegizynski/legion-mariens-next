"use client"

import { useState, useCallback } from "react"
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api"
import MarkerItem from "@/app/persoenlichkeiten/praesidenten-des-senatus/gruppen-in-oesterreich/_components/MarkerItem"

const GoogleMaps = ({ presidiumData }) => {
	const containerStyle = {
		width: "100%",
		height: "80vh",
	}

	const [center, setCenter] = useState({
		lat: 48.2012727,
		lng: 16.3898604,
	})

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
	})

	const [map, setMap] = useState(null)

	const onLoad = useCallback(function callback(map) {
		// This is just an example of getting and using the map instance!!! don't just blindly copy!
		const bounds = new window.google.maps.LatLngBounds(center)
		map.fitBounds(bounds)

		setMap(map)
	}, [])

	const onUnmount = useCallback(function callback(map) {
		setMap(null)
	}, [])

	console.log({ presidiumData })

	return isLoaded ? (
		<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16} onLoad={onLoad} onUnmount={onUnmount}>
			{presidiumData.map((presidium, index) => (
				<MarkerItem key={`presidium_${index}`} presidium={presidium.attributes} />
			))}
		</GoogleMap>
	) : (
		<></>
	)
}

export default GoogleMaps
