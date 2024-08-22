"use client"

import { useEffect, useState } from "react"
import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import GoogleMaps from "@/app/persoenlichkeiten/praesidenten-des-senatus/gruppen-in-oesterreich/_components/GoogleMaps"
import TitleContext from "@/components/base/common/TitleContent"

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
		<article>
			<TitleContext title="Gruppen in Österreich" />
			<section>
				<div>
					<label htmlFor="search">Suche nach einer PLZ oder Stadt:</label>
					<input type="text" id="search" name="search" />
				</div>
			</section>
			<GoogleMaps presidiumData={presidiumData} />
		</article>
	)
}

export default groupsInAustria
