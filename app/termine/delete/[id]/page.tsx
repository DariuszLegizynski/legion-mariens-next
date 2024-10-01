"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getStrapiData, createStrapiAuthData } from "@/app/_utils/services/getStrapiData"
import BaseButton from "@/components/base/BaseButton"
import Cookies from "js-cookie"

const DeleteEvent = ({ params }: { params: { id: string } }) => {
	const router = useRouter()
	let startTime = null
	startTime ? sessionStorage.removeItem("deleteSingleStartTime") : null
	startTime = sessionStorage.getItem("deleteSingleStartTime")

	const startDate = new Date(startTime)

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

		const deleteOcurrenceEventData = {
			data: {
				reason: reason,
				userEmail: userEmail,
				events: params.id,
				name,
				surname,
				exceptionDate: startDate,
				publishedAt: null,
			},
		}

		try {
			if (startTime) {
				console.log("occurence delete: ", deleteOcurrenceEventData)
				await createStrapiAuthData(`event-exceptions`, deleteOcurrenceEventData, jwt!)
				sessionStorage.removeItem("deleteSingleStartTime")
				setLoading(false)
				router.push("/termine")
				return
			}
			console.log("delete: ", deleteEventData)
			await createStrapiAuthData(`delete-event-requests`, deleteEventData, jwt!)
			sessionStorage.removeItem("deleteSingleStartTime")
			setLoading(false)
			router.push("/termine")
		} catch (error) {
			setLoading(false)
			console.error("Error deleting event:", error.message)
			setError(error.message)
		}
	}

	if (!eventData) return <p className="text-center my-24">Loading...</p>
	if (error) return <p className="text-center my-24">{error}</p>

	return (
		<div className="container px-4 my-8 mx-auto">
			<h1 className="my-4">Sind sie sich sicher, dass sie diesen Termin löschen wollen?</h1>
			<p className="mt-8">
				Titel: <b>{eventData.attributes?.title}</b>
			</p>
			<p className="mt-2 mb-8">
				Am:{" "}
				{startDate
					? startDate.toLocaleDateString("de-DE", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
					  })
					: eventData.attributes?.startTime.split("T")[0]}
			</p>
			<section className="max-w-72 mx-auto">
				<div className="my-4">
					<label htmlFor="name">Vorname:</label>
					<input id="name" onChange={e => setName(e.target.value)} />
				</div>
				<div className="mb-4">
					<label htmlFor="surname">Zuname:</label>
					<input id="surname" onChange={e => setSurname(e.target.value)} />
				</div>
				<div className="mb-4">
					<label htmlFor="reasonEmail">Email:</label>
					<input id="reasonEmail" onChange={e => setUserEmail(e.target.value)} />
				</div>
				<div className="mb-4">
					<label htmlFor="reasonDescription">Begründung:</label>
					<textarea id="reasonDescription" onChange={e => setReason(e.target.value)} />
				</div>
			</section>
			<div className="mt-4 flex flex-col items-center sm:my-12">
				<BaseButton buttonType="submit" onClick={handleDeleteEvent} disabled={loading} text={loading ? "Löschen..." : "Termin Löschen"} />
			</div>
		</div>
	)
}

export default DeleteEvent
