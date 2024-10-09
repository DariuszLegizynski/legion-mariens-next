"use client"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"

import EventModal from "./EventModal"
import { Event } from "@/types/Event"

const EventComponent = ({ eventItem, isVisible }: { eventItem: Event; isVisible: boolean }) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [shouldAnimate, setShouldAnimate] = useState<boolean>(true)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	useEffect(() => {
		if (typeof window !== "undefined") {
			sessionStorage.removeItem("deleteSingleStartTime")
			sessionStorage.removeItem("editSingleStartTime")
			sessionStorage.removeItem("editSingleOccurrenceId")
		}
	}, [])

	useEffect(() => {
		if (!isVisible) {
			setShouldAnimate(false)
		}
	}, [isVisible])

	const isCookie = Cookies.get("jwt")
	useEffect(() => {
		setIsAuthenticated(Cookies.get("jwt") ? true : false)
	}, [isCookie])

	const startTime = new Date(eventItem.attributes?.startTime)
	const day = startTime.toLocaleDateString("de-DE", {
		day: "numeric",
	})
	const month = startTime
		.toLocaleDateString("de-DE", {
			month: "short",
		})
		.slice(0, 3)
	const year = startTime.toLocaleDateString("de-DE", {
		year: "numeric",
	})
	const time = startTime.toLocaleTimeString("de-DE", {
		hour: "numeric",
		minute: "numeric",
	})

	return (
		<>
			{shouldAnimate && (
				<section
					onClick={() => setIsModalOpen(true)}
					className={`grid grid-cols-[auto_1fr] gap-x-8 min-h-[8.5rem] border border-grey border-b-primary border-b-[3px] py-3 px-4 w-full max-w-96 cursor-pointer scale-on-hover ${
						isVisible ? "slide-up" : "slide-down"
					}`}
				>
					<div className="flex flex-col items-center justify-between">
						<p className="inline-flex items-start h1 !leading-none mb-1.5" style={{ fontFamily: "Open-Sans, sans-serif" }}>
							{day}
						</p>
						<div className="flex flex-col items-center gap-y-0.5">
							<span className="uppercase">{month}</span>
							<span>{year}</span>
						</div>
						<p>{time}</p>
					</div>
					<div className="grid grid-cols-1 grid-rows-[17px_1fr_auto_24px] justify-between">
						<small>
							{eventItem.attributes?.categories?.data.slice(0, 2).map((cat, index) => (
								<span key={index} className="after:content-['|'] last:after:content-none after:px-1">
									{cat.attributes?.category}
								</span>
							))}
							{eventItem.attributes?.categories?.data.length > 2 && <span className="after:px-1">...</span>}
						</small>
						<div className="strong inline-flex items-start">{eventItem.attributes?.title}</div>
						<small className="inline-flex items-center py-1">für {eventItem.attributes?.participantRestriction?.split("für")[1]?.trim()}</small>
						<div className="flex justify-between items-end w-full">
							<p>
								{eventItem?.attributes?.event_state?.data?.attributes?.abbreviation}&nbsp;|&nbsp;{eventItem?.attributes?.arrival?.city}
							</p>
							<p className="text-right">&rarr;</p>
						</div>
					</div>
				</section>
			)}
			{isModalOpen && <EventModal eventItem={eventItem} onClose={() => setIsModalOpen(false)} isAuth={isAuthenticated} />}
		</>
	)
}

export default EventComponent
