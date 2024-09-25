"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getStrapiData, createStrapiAuthData } from "@/app/_utils/services/getStrapiData"
import BaseButton from "@/components/base/BaseButton"
import Cookies from "js-cookie"

const DeleteEvent = ({ params }: { params: { id: string } }) => {
	const router = useRouter()
	const jwt = Cookies.get("jwt")

	const [eventData, setEventData] = useState(new Date())
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [reason, setReason] = useState("")
	const [userEmail, setUserEmail] = useState("")
	const [name, setName] = useState("")
	const [surname, setSurname] = useState("")

	// Fetch event details
	useEffect(() => {
		const fetchEventData = async () => {
			try {
				const response = await getStrapiData(`events/${params.id}?populate=*`)
				setEventData(response.data)
			} catch (err) {
				console.error(err)
				setError("Error fetching event data")
			}
		}
		fetchEventData()
	}, [params.id])

	// Handle event deletion
	const handleDeleteEvent = async () => {
		setLoading(true)

		const deleteEventData = {
			data: {
				reason: reason,
				userEmail: userEmail,
				events: params.id,
				name,
				surname,
			},
		}

		try {
			await createStrapiAuthData(`delete-event-requests`, deleteEventData, jwt!)
			setLoading(false)
			// router.push("/termine")
		} catch (error) {
			setLoading(false)
			console.error("Error deleting event:", error.message)
			setError("Error deleting event")
		}
	}

	if (!eventData) return <p>Loading...</p>
	if (error) return <p>{error}</p>

	return (
		<div className="container mx-auto my-8">
			<h1>Sind sie sich sicher, dass sie diesen Termin löschen wollen?</h1>
			<p>Titel: {eventData.attributes?.title}</p>
			<p>Am: {eventData.attributes?.startTime.split("T")[0]}</p>
			<div>
				<label htmlFor="name">Vorname:</label>
				<input id="name" onChange={e => setName(e.target.value)} />
			</div>
			<div>
				<label htmlFor="surname">Zuname:</label>
				<input id="surname" onChange={e => setSurname(e.target.value)} />
			</div>
			<div>
				<label htmlFor="reasonEmail">Email:</label>
				<input id="reasonEmail" onChange={e => setUserEmail(e.target.value)} />
			</div>
			<div>
				<label htmlFor="reasonDescription">Begründung:</label>
				<textarea id="reasonDescription" onChange={e => setReason(e.target.value)} />
			</div>

			<div className="mt-4">
				<BaseButton buttonType="submit" onClick={handleDeleteEvent} disabled={loading} text={loading ? "Deleting..." : "Delete Event"} />
			</div>
		</div>
	)
}

export default DeleteEvent
