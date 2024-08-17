"use client"
import { useState, useEffect } from "react"
import EventModal from "./EventModal"
import { Event } from "@/types/Event"

const EventComponent = ({ eventItem, isVisible }: { eventItem: Event; isVisible: boolean }) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [shouldAnimate, setShouldAnimate] = useState<boolean>(true)

	useEffect(() => {
		if (!isVisible) {
			setShouldAnimate(false)
		}
	}, [isVisible])

	const startTime = new Date(eventItem.attributes.startTime)
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
					className={`grid grid-cols-[auto_1fr] gap-x-8 min-h-[8.5rem] border border-grey border-b-primary border-b-[3px] py-3 px-4 w-full max-w-96 ${
						isVisible ? "slide-up" : "slide-down"
					}`}
				>
					<div className="flex flex-col items-center justify-start ml-2">
						<p className="h1 mb-1.5" style={{ fontFamily: "Open-Sans, sans-serif" }}>
							{day}
						</p>
						<span className="uppercase">{month}</span>
						<span>{year}</span>
					</div>
					<div className="flex flex-col justify-between">
						<div className="mb-2">
							<small>{eventItem.attributes?.category?.data?.attributes.category}</small>
							<div className="strong">{eventItem.attributes.title}</div>
						</div>
						<div className="flex justify-between">
							<p>ab {time}</p>
							<p>&rarr;</p>
						</div>
					</div>
				</section>
			)}
			{isModalOpen && <EventModal eventItem={eventItem} onClose={() => setIsModalOpen(false)} />}
		</>
	)
}

export default EventComponent
