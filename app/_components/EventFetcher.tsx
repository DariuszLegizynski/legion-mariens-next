import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import { Event } from "@/types/Event"

const generateRecurringEvents = (event: Event) => {
	console.log({ event })
	const occurrences = []
	const { startTime, repeat } = event.attributes

	if (!repeat) return [event]

	const recurrenceType = repeat.recurrenceType
	const recurrenceEndDate = new Date(repeat.recurrenceEndDate)
	let currentDate = new Date(startTime)

	while (currentDate <= recurrenceEndDate) {
		occurrences.push({
			...event,
			attributes: { ...event.attributes, startTime: currentDate.toISOString() },
		})

		switch (recurrenceType) {
			case "weekly":
				currentDate.setDate(currentDate.getDate() + 7)
				break
			case "monthly":
				currentDate.setMonth(currentDate.getMonth() + 1)
				break
			case "yearly":
				currentDate.setFullYear(currentDate.getFullYear() + 1)
				break
			default:
				break
		}
	}
	console.log({ occurrences })
	return occurrences
}

export async function fetchEvents() {
	const today = new Date().toISOString()
	const response = await getStrapiData(`events?filters[startTime][$gte]=${today}&populate=*&sort=startTime:ASC`)
	const eventList = response.data

	const expandedEvents = eventList.flatMap((event: Event) => generateRecurringEvents(event))

	const sortedEvents = expandedEvents.sort((a, b) => {
		const dateA = new Date(a.attributes.startTime)
		const dateB = new Date(b.attributes.startTime)
		return dateA.getTime() - dateB.getTime()
	})

	return sortedEvents
}
