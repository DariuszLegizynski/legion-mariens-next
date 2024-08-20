"use client"

import { useState, useEffect } from "react"
import { getStrapiData } from "@/app/_utils/services/getStrapiData"

// components
import EventComponent from "./EventComponent"
import EventCalendar from "./EventCalendar"

// type
import type { Event } from "@/types/Event"
import type { Category } from "@/types/Category"

const EventList = () => {
	const [eventList, setEventList] = useState<Event[]>([])
	const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [startDate, setStartDate] = useState<string>("")
	const [endDate, setEndDate] = useState<string>("")
	const [category, setCategory] = useState<string>("Alle Kategorien")

	useEffect(() => {
		const fetchEvents = async () => {
			const today = new Date().toISOString()
			const response = await getStrapiData(`events?filters[startTime][$gte]=${today}&populate=*&sort=startTime:ASC`)

			setEventList(response.data)
		}
		fetchEvents()

		const fetchCategories = async () => {
			const response = await getStrapiData("categories?populate=*&sort=category:ASC")
			setCategories(response.data)
		}
		fetchCategories()
	}, [])

	useEffect(() => {
		let filtered = eventList

		if (startDate) {
			filtered = filtered.filter(event => new Date(event.attributes.startTime) >= new Date(startDate))
		}

		if (endDate) {
			filtered = filtered.filter(event => new Date(event.attributes.startTime) <= new Date(endDate))
		}

		if (category && category !== "Alle Kategorien") {
			filtered = filtered.filter(event => event.attributes?.category?.data?.attributes.category === category)
		}

		setFilteredEvents(filtered)
	}, [startDate, endDate, category, eventList])

	return (
		<>
			<EventCalendar categories={categories} setCategory={setCategory} setStartDate={setStartDate} setEndDate={setEndDate} />
			<div className="grid grid-cols-1 justify-items-center gap-8 mx-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredEvents.length > 0 ? (
					filteredEvents.map((eventItem: Event, index) => <EventComponent key={`event_${index}`} eventItem={eventItem} isVisible={true} />)
				) : (
					<p className="mt-16 text-center">Keine Ereignisse für diese Kriterien gefunden.</p>
				)}
			</div>
		</>
	)
}

export default EventList
