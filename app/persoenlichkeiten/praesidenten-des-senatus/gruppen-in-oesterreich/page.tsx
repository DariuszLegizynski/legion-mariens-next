"use client"

import { useEffect, useState } from "react"
import { getStrapiData } from "@/app/_utils/services/getStrapiData"

import TitleContent from "@/components/common/TitleContent"
import SearchAdress from "./_components/SearchAdress"

import dynamic from "next/dynamic"
export const GeoMap = dynamic(() => import("@/app/persoenlichkeiten/praesidenten-des-senatus/gruppen-in-oesterreich/_components/GeoMap"), { ssr: false })

const groupsInAustria = () => {
	const [pageContent, setPageContent] = useState(null)
	const [presidiumData, setPresidiumData] = useState([])
	const [selectedPresidium, setSelectedPresidium] = useState(null)

	useEffect(() => {
		const fetchPage = async () => {
			const response = await getStrapiData(`groups-in-austria?populate=*`)
			setPageContent(response.data?.attributes?.content)
		}
		fetchPage()

		const fetchPresidium = async () => {
			const response = await getStrapiData(`presidiums?populate=*`)
			setPresidiumData(response.data)
		}
		fetchPresidium()
	}, [])

	return (
		<article className="max-container my-24 mx-4">
			<TitleContent title={pageContent?.title} content={pageContent?.content} />
			<SearchAdress presidiumData={presidiumData} setSelectedPresidium={setSelectedPresidium} />
			<GeoMap presidiumData={presidiumData} selectedPresidium={selectedPresidium?.attributes} />
		</article>
	)
}

export default groupsInAustria
