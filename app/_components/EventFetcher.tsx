import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import { Event } from "@/types/Event"
import { format, addDays, addMonths, addYears, isBefore } from "date-fns"

const applyExceptions = async (events: any[]) => {
	const response = await getStrapiData(`event-exceptions?populate=*`)
	const exceptions = response?.data ? response.data : []
	const exceptionDates = new Set(exceptions.map(exc => format(new Date(exc.attributes.exceptionDate), "yyyy-MM-dd")))

	return events.filter(eventItem => {
		return !exceptionDates.has(format(new Date(eventItem.attributes.startTime), "yyyy-MM-dd"))
	})
}

const generateRecurringEvents = (event: Event) => {
	const occurrences = []
	const { startTime, endTime, repeat } = event.attributes

	if (!repeat) return [event]

	const recurrenceType = repeat.recurrenceType
	const recurrenceEndDate = new Date(repeat.recurrenceEndDate)
	let currentDate = new Date(startTime)
	let eventEndDate = endTime ? new Date(endTime) : null

	while (!isBefore(recurrenceEndDate, currentDate)) {
		occurrences.push({
			...event,
			attributes: {
				...event.attributes,
				startTime: format(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
				endTime: eventEndDate ? format(eventEndDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : null,
			},
		})

		switch (recurrenceType) {
			case "weekly":
				currentDate = addDays(currentDate, 7)
				if (eventEndDate) eventEndDate = addDays(eventEndDate, 7)
				break
			case "monthly":
				currentDate = addMonths(currentDate, 1)
				if (eventEndDate) eventEndDate = addMonths(eventEndDate, 1)
				break
			case "yearly":
				currentDate = addYears(currentDate, 1)
				if (eventEndDate) eventEndDate = addYears(eventEndDate, 1)
				break
			default:
				break
		}
	}

	return occurrences
}

export async function fetchEvents() {
	const today = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
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
