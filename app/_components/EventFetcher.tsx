import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import { Event } from "@/types/Event"
import { format, addDays, addMonths, addYears, isBefore } from "date-fns"

const applyExceptions = async (events: any[]) => {
	const response = await getStrapiData(`event-exceptions?populate=*`)
	const exceptions = response?.data ? response.data : []

	return events
		.map(eventItem => {
			const occurrenceId = eventItem.attributes.occurrenceId

			const eventExceptions = exceptions.filter(exc => exc.attributes.occurrenceId === occurrenceId)

			if (eventExceptions.length === 0) {
				return eventItem
			}

			let updatedEvent = { ...eventItem }
			eventExceptions.forEach(eventException => {
				if (eventException?.attributes?.isExcluded) {
					updatedEvent = null
				} else {
					updatedEvent = {
						...eventItem,
						attributes: {
							...eventItem.attributes,
							startTime: eventException?.attributes?.startTime || eventItem?.attributes?.startTime,
							endTime: eventException?.attributes?.endTime || eventItem?.attributes?.endTime,
							description: eventException?.attributes?.description || eventItem?.attributes?.description,
							title: eventException?.attributes?.title || eventItem?.attributes?.title,
							applicant: eventException?.attributes?.applicant || eventItem?.attributes?.applicant,
							arrival: eventException?.attributes?.arrival || eventItem?.attributes?.arrival,
							createdAt: eventException?.attributes?.createdAt || eventItem?.attributes?.createdAt,
							event: eventException?.attributes?.event || eventItem?.attributes?.event,
							event_state: eventException?.attributes?.event_state || eventItem?.attributes?.event_state,
							event_assignment: eventException?.attributes?.event_assignment || eventItem?.attributes?.event_assignment,
							event_categories: eventException?.attributes?.event_categories || eventItem?.attributes?.event_categories,
							participantRestriction: eventException?.attributes?.participantRestriction || eventItem?.attributes?.participantRestriction,
							publishedAt: eventException?.attributes?.publishedAt || eventItem?.attributes?.publishedAt,
							registration: eventException?.attributes?.registration || eventItem?.attributes?.registration,
							repeat: eventException?.attributes?.repeat || eventItem?.attributes?.repeat,
						},
					}
				}
			})

			return updatedEvent
		})
		.filter(Boolean)
}

const generateRecurringEvents = (event: Event) => {
	const occurrences = []
	const { startTime, endTime, repeat } = event.attributes

	if (!repeat) return [event]

	const recurrenceType = repeat.recurrenceType
	const recurrenceEndDate = new Date(repeat.recurrenceEndDate)
	let currentTime = new Date(startTime)
	let eventEndTime = endTime ? new Date(endTime) : null

	while (!isBefore(recurrenceEndDate, currentTime)) {
		occurrences.push({
			...event,
			attributes: {
				...event.attributes,
				startTime: format(currentTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
				endTime: eventEndTime ? format(eventEndTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : null,
				occurrenceId: `${event.id}-${format(currentTime, "yyyy-MM-dd'T'HH-mm-ss-SSS'Z'")}`,
			},
		})

		switch (recurrenceType) {
			case "weekly":
				currentTime = addDays(currentTime, 7)
				if (eventEndTime) eventEndTime = addDays(eventEndTime, 7)
				break
			case "monthly":
				currentTime = addMonths(currentTime, 1)
				if (eventEndTime) eventEndTime = addMonths(eventEndTime, 1)
				break
			case "yearly":
				currentTime = addYears(currentTime, 1)
				if (eventEndTime) eventEndTime = addYears(eventEndTime, 1)
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
