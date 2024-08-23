"use client"

import { useEffect, useState } from "react"
import { getStrapiData } from "@/app/_utils/services/getStrapiData"

import TitleContext from "@/components/base/common/TitleContent"
import GeoMap from "@/app/persoenlichkeiten/praesidenten-des-senatus/gruppen-in-oesterreich/_components/GeoMap"

const groupsInAustria = () => {
	const [presidiumData, setPresidiumData] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const response = await getStrapiData(`presidiums?populate=*`)
			setPresidiumData(response.data)
		}
		fetchData()
	}, [])

	return (
		<article className="max-container mx-4">
			<TitleContext title="Gruppen in Österreich" />
			<section>
				<div>
					<label htmlFor="search">Suche nach einer PLZ oder Stadt:</label>
					<input type="text" id="search" name="search" />
				</div>
			</section>
			<GeoMap presidiumData={presidiumData} />
		</article>
	)
}

export default groupsInAustria
