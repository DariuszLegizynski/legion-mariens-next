import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import { Event } from "@/types/Event"
import { format, addDays, addMonths, addYears, isBefore } from "date-fns"
import { desc } from "framer-motion/client"
import { title } from "process"

const applyExceptions = async (events: any[]) => {
	const response = await getStrapiData(`event-exceptions?populate=*`)
	const exceptions = response?.data ? response.data : []

	return events
		.map(eventItem => {
			const occurrenceDate = format(new Date(eventItem.attributes.startTime), "yyyy-MM-dd")

			// Find if there's an exception for this occurrence
			const eventException = exceptions.find(exc => {
				const exceptionDate = format(new Date(exc.attributes.exceptionDate), "yyyy-MM-dd")
				return exc.attributes.event.data.id === eventItem.id && exceptionDate === occurrenceDate
			})

			// If exception exists and it's marked as excluded, skip this occurrence
			if (eventException?.attributes?.isExcluded) {
				return null
			}

			// If there's an exception and it's modifying the event, update the occurrence
			if (eventException) {
				console.log({ eventItem, eventException })
				return {
					...eventItem,
					attributes: {
						...eventItem.attributes,
						startTime: eventException.attributes.startDate || eventItem.attributes.startTime,
						endTime: eventException.attributes.endDate || eventItem.attributes.endTime,
						description: eventException.attributes.description || eventItem.attributes.description,
						title: eventException.attributes.title || eventItem.attributes.title,
						applicant: eventException.attributes.applicant || eventItem.attributes.applicant,
						createdAt: eventException.attributes.createdAt || eventItem.attributes.createdAt,
						endDate: eventException.attributes.endDate || eventItem.attributes.endDate,
						event: eventException.attributes.event || eventItem.attributes.event,
						eventData: eventException.attributes.eventData || eventItem.attributes.eventData,
						event_state: eventException.attributes.event_state || eventItem.attributes.event_state,
						event_assignment: eventException.attributes.event_assignment || eventItem.attributes.event_assignment,
						event_categories: eventException.attributes.event_categories || eventItem.attributes.event_categories,
						participantRestriction: eventException.attributes.participantRestriction || eventItem.attributes.participantRestriction,
						publishedAt: eventException.attributes.publishedAt || eventItem.attributes.publishedAt,
						registration: eventException.attributes.registration || eventItem.attributes.registration,
						repeat: eventException.attributes.repeat || eventItem.attributes.repeat,
					},
				}
			}

			// No exception found, return the original eventItem
			return eventItem
		})
		.filter(Boolean)
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
