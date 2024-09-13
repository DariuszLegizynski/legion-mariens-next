import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import { Event } from "@/types/Event"

const applyExceptions = async (events: any[]) => {
	const response = await getStrapiData(`event-exceptions?populate=*`)
	const exceptions = response?.data ? response.data : []

	const exceptionDates = new Set(exceptions.map(exc => new Date(exc.attributes.exceptionDate).toDateString()))

	console.log({ events, exceptions })

	return events.filter(eventItem => {
		return !exceptionDates.has(new Date(eventItem.attributes.startTime).toDateString())
	})
}

const generateRecurringEvents = (event: Event) => {
	const occurrences = []
	const { startTime, endTime, repeat } = event.attributes

	if (!repeat) return [event]

	const recurrenceType = repeat.recurrenceType
	const recurrenceEndDate = new Date(repeat.recurrenceEndDate)
	const currentDate = new Date(startTime)
	const endDate = endTime ? new Date(endTime) : null

	while (currentDate <= recurrenceEndDate) {
		occurrences.push({
			...event,
			attributes: { ...event.attributes, startTime: currentDate.toISOString(), endTime: endDate?.toISOString() },
		})

		switch (recurrenceType) {
			case "weekly":
				currentDate.setDate(currentDate.getDate() + 7)
				endDate?.setDate(endDate.getDate() + 7)
				break
			case "monthly":
				currentDate.setMonth(currentDate.getMonth() + 1)
				endDate?.setMonth(endDate.getMonth() + 1)
				break
			case "yearly":
				currentDate.setFullYear(currentDate.getFullYear() + 1)
				endDate?.setFullYear(endDate.getFullYear() + 1)
				break
			default:
				break
		}
	}

	return occurrences
}

export async function fetchEvents() {
	const today = new Date().toISOString()
	const response = await getStrapiData(`events?filters[startTime][$gte]=${today}&populate=*&sort=startTime:ASC`)
	const eventList = response.data

	const expandedEvents = eventList.flatMap((event: Event) => generateRecurringEvents(event))

	const exceptionOccurrences = await applyExceptions(expandedEvents)

	const sortedEvents = exceptionOccurrences.sort((a, b) => {
		const dateA = new Date(a.attributes.startTime)
		const dateB = new Date(b.attributes.startTime)
		return dateA.getTime() - dateB.getTime()
	})

	return sortedEvents
}
