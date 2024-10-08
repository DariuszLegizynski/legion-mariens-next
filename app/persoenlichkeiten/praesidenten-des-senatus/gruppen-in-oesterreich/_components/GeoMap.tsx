"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import { divIcon } from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import MarkerItem from "@/app/persoenlichkeiten/praesidenten-des-senatus/gruppen-in-oesterreich/_components/MarkerItem"

const GeoMap = ({ presidiumData, selectedPresidium }) => {
	const [center, setCenter] = useState([47.3939887, 13.6861309])
	const [zoom, setZoom] = useState(7)

	const createCustomClusterIcon = cluster => {
		const svgIcon = `
		<svg xmlns="http://www.w3.org/2000/svg" width="68.267" height="68.267" viewBox="0 0 64 64"><path fill="#FFF" stroke="#000" d="m48.67 33.11-7.78 1.11L32 57.56l-7.78-20-8.89 2.22V13.11l33.34-6.67v26.67Z"/></svg>
		`

		return new divIcon({
			html: `<div class="cluster-icon">${svgIcon}<p class="cluster-icon-text">${cluster.getChildCount()}</p></div>`,
		})
	}

	const MapControl = () => {
		const map = useMap()

		useEffect(() => {
			if (selectedPresidium) {
				const { lat, lng } = selectedPresidium?.location?.coordinates || {}
				map.flyTo([lat, lng], 15, { animate: true })
			}
		}, [selectedPresidium, map])

		return null
	}

	return (
		<MapContainer center={center} zoom={zoom} scrollWithZoom={false}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<MapControl />
			<MarkerClusterGroup chunkedLoading iconCreateFunction={createCustomClusterIcon}>
				{presidiumData.map((presidium, index) => (
					<MarkerItem key={`presidium_${index}`} presidium={presidium.attributes} />
				))}
			</MarkerClusterGroup>
		</MapContainer>
	)
}

export default GeoMap
