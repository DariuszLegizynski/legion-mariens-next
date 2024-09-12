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
	const [states, setStates] = useState<Category[]>([])
	const [state, setState] = useState<string>("Alle Bundesländer")
	const [assignments, setAssignments] = useState<Category[]>([])
	const [assignment, setAssignment] = useState<string>("Beides")

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

		const fetchStates = async () => {
			const response = await getStrapiData("event-states?populate=*") //&sort=event-states:ASC")
			setStates(response.data)
		}
		fetchStates()

		const fetchAssignments = async () => {
			const response = await getStrapiData("event-assignments?populate=*") //&sort=event-assignments:ASC")
			setAssignments(response.data)
		}
		fetchAssignments()
	}, [])

	useEffect(() => {
		let filtered = eventList
		console.log({ filtered })

		if (startDate) {
			filtered = filtered.filter(event => new Date(event.attributes?.startTime) >= new Date(startDate))
		}

		if (endDate) {
			filtered = filtered.filter(event => new Date(event.attributes?.startTime) <= new Date(endDate))
		}

		if (category && category !== "Alle Kategorien") {
			filtered = filtered.filter(event => event?.attributes?.categories?.data.some(cat => cat.attributes?.category === category))
		}

		if (state && state !== "Alle Bundesländer") {
			filtered = filtered.filter(stateItem => stateItem.attributes?.event_state?.data?.attributes?.name === state)
		}

		if (assignment && assignment !== "Beides") {
			filtered = filtered.filter(assignmentItem => assignmentItem.attributes?.event_assignment?.data?.attributes?.name === assignment)
		}

		setFilteredEvents(filtered)
	}, [startDate, endDate, category, assignment, state, eventList])

	return (
		<>
			<EventCalendar
				categories={categories}
				setCategory={setCategory}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				states={states}
				setState={setState}
				assignments={assignments}
				setAssignment={setAssignment}
			/>
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
