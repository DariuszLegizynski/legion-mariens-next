"use client"

import { useEffect, useState } from "react"
import { getStrapiData } from "@/app/_utils/services/getStrapiData"

import TitleContext from "@/components/base/common/TitleContent"
import GeoMap from "@/app/persoenlichkeiten/praesidenten-des-senatus/gruppen-in-oesterreich/_components/GeoMap"
import SearchAdress from "./_components/SearchAdress"

const groupsInAustria = () => {
	const [presidiumData, setPresidiumData] = useState([])
	const [selectedPresidium, setSelectedPresidium] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			const response = await getStrapiData(`presidiums?populate=*`)
			setPresidiumData(response.data)
		}
		fetchData()
	}, [])

	console.log({ selectedPresidium })

	return (
		<article className="max-container my-24 mx-4">
			<TitleContext title="Gruppen in Österreich" />
			<SearchAdress presidiumData={presidiumData} setSelectedPresidium={setSelectedPresidium} />
			<GeoMap presidiumData={presidiumData} selectedPresidium={selectedPresidium?.attributes} />
		</article>
	)
}

export default groupsInAustria
