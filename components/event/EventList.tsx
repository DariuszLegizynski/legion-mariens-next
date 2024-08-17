"use client"

import { useState, useEffect } from "react"

// components
import EventComponent from "./EventComponent"
import EventCalendar from "./EventCalendar"

import { Event } from "@/types/Event"

const EventList = ({ initialEvents, initialCategories }) => {
	const [eventList, setEventList] = useState<Event[]>(initialEvents)
	const [filteredEvents, setFilteredEvents] = useState(initialEvents)
	const [categories, setCategories] = useState(initialCategories)
	const [startDate, setStartDate] = useState("")
	const [endDate, setEndDate] = useState("")
	const [category, setCategory] = useState("Alle Kategorien")

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

// This function runs on the server side at request time
export async function getServerSideProps() {
	const today = new Date().toISOString()

	// Fetch events
	const eventsResponse = await fetch(`${process.env.API_URL}/api/events?filters[startTime][$gte]=${today}&populate=*&sort=startTime:ASC`)
	const eventsData = await eventsResponse.json()

	// Fetch categories
	const categoriesResponse = await fetch(`${process.env.API_URL}/api/categories?populate=*&sort=category:ASC`)
	const categoriesData = await categoriesResponse.json()

	return {
		props: {
			initialEvents: eventsData.data, // Pass events data to the component as props
			initialCategories: categoriesData.data, // Pass categories data to the component as props
		},
	}
}

export default EventList
