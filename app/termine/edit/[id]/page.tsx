"use client"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import BaseButton from "@/components/base/BaseButton"
import { createStrapiAuthData, getStrapiData } from "@/app/_utils/services/getStrapiData"
import Select from "react-select"
import { format } from "date-fns"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const EditEvent = ({ params }: { params: { id: string } }) => {
	const [eventData, setEventData] = useState()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [title, setTitle] = useState("")
	const [categories, setCategories] = useState([])
	const [startTime, setStartTime] = useState<Date>()
	const [endTime, setEndTime] = useState<Date>()
	const [description, setDescription] = useState("")
	const [arrival, setArrival] = useState({
		street: "",
		number: "",
		city: "",
		country: "",
		organiser: "",
		contactPerson: "",
		phone: "",
		email: "",
		shortDescription: "",
		addressAddition: "",
	})
	const [isRecurrent, setIsRecurrent] = useState(false)
	const [repeat, setRepeat] = useState<{
		recurrenceType: string
		recurrenceEndDate: Date | null
	}>({
		recurrenceType: "",
		recurrenceEndDate: null,
	})
	const [participantRestriction, setParticipantRestriction] = useState(null)
	const [selectedCategories, setSelectedCategories] = useState([])
	const [selectedAssignment, setSelectedAssignment] = useState([])
	const [assignments, setAssignments] = useState([])
	const [selectedState, setSelectedState] = useState([])
	const [states, setStates] = useState([])
	const [registration, setRegistration] = useState({
		isRegistration: false,
		registrationDescription: "",
	})
	const [applicant, setApplicant] = useState({
		name: "",
		surname: "",
		email: "",
	})
	const [request, setRequest] = useState({
		loading: false,
		complete: false,
		error: false,
	})

	const primaryColour = "hsl(227, 46%, 44%)"
	const primaryLightColour = "hsl(227, 46%, 64%)"
	const whiteColour = "hsl(5, 0%, 100%)"

	const customStyles = {
		control: provided => ({
			...provided,
			borderRadius: "0",
			borderColor: primaryColour,
			borderWidth: "2px",
			"&:hover": {
				borderColor: primaryLightColour,
			},
		}),
		multiValue: provided => ({
			...provided,
			backgroundColor: primaryLightColour,
		}),
		multiValueLabel: styles => ({
			...styles,
			color: whiteColour,
		}),
		multiValueRemove: styles => ({
			...styles,
			color: primaryColour,
			":hover": {
				backgroundColor: primaryColour,
				color: whiteColour,
			},
		}),
		placeholder: styles => ({ ...styles, color: primaryColour }),
	}

	const jwt = Cookies.get("jwt")

	useEffect(() => {
		const fetchAssignments = async () => {
			const response = await getStrapiData("event-assignments?populate=*")
			setAssignments(response.data)
		}
		fetchAssignments()

		const fetchStates = async () => {
			const response = await getStrapiData("event-states?populate=*")
			setStates(response.data)
		}
		fetchStates()
	}, [])

	useEffect(() => {
		const fetchEventData = async () => {
			try {
				const response = await getStrapiData(`events/${params.id}?populate=*`)
				setEventData(response.data.attributes)
			} catch (err) {
				console.error(err)
				setError("Error fetching event data")
			}
		}
		fetchEventData()
	}, [params.id])

	console.log({ eventData })

	useEffect(() => {
		if (eventData) {
			setTitle(eventData?.title || "")
			setStartTime(eventData?.startTime ? new Date(eventData?.startTime) : null)
			setEndTime(eventData?.endTime ? new Date(eventData?.endTime) : null)
			setDescription(eventData?.description || "")

			setArrival({
				street: eventData?.arrival?.street || "",
				number: eventData?.arrival?.number || "",
				city: eventData?.arrival?.city || "",
				country: eventData?.arrival?.country || "",
				organiser: eventData?.arrival?.organiser || "",
				contactPerson: eventData?.arrival?.contactPerson || "",
				phone: eventData?.arrival?.phone || "",
				email: eventData?.arrival?.email || "",
				shortDescription: eventData?.arrival?.shortDescription || "",
				addressAddition: eventData?.arrival?.addressAddition || "",
			})

			setIsRecurrent(eventData?.isRecurrent || false)
			setRepeat({
				recurrenceType: eventData?.repeat?.recurrenceType || "",
				recurrenceEndDate: eventData?.repeat?.recurrenceEndDate ? new Date(eventData?.repeat.recurrenceEndDate) : null,
			})

			setParticipantRestriction(eventData?.participantRestriction || null)

			setCategories(eventData?.categories || [])
			// setSelectedCategories(eventData?.categories?.map(category => category.id) || [])
			// setAssignments(eventData?.assignments || [])
			setSelectedAssignment(eventData?.event_assignment?.data.attributes?.name)
			// setStates(eventData?.states || [])
			setSelectedState(eventData?.event_state?.data?.attributes?.name || null)

			setRegistration({
				isRegistration: eventData?.registration?.isRegistration || false,
				registrationDescription: eventData?.registration?.registrationDescription || "",
			})

			setApplicant({
				name: eventData?.applicant?.name || "",
				surname: eventData?.applicant?.surname || "",
				email: eventData?.applicant?.email || "",
			})

			setRequest({
				loading: false,
				complete: false,
				error: false,
			})
		}
	}, [eventData])

	const recurrenceTypes = [
		{ id: 0, name: "Wöchentlich", value: "weekly" },
		{ id: 1, name: "Monatlich", value: "monthly" },
		{ id: 2, name: "Jährlich", value: "yearly" },
	]

	const recurrenceTypeOptions = recurrenceTypes.map(recurrenceType => {
		return { id: recurrenceType.id, value: recurrenceType.value, label: recurrenceType.name }
	})

	const assignmentOptions = assignments.map(assignment => {
		return { id: assignment.id, value: assignment.attributes.name, label: assignment.attributes?.name }
	})

	const stateOptions = states.map(state => {
		return { id: state.id, value: state.attributes.name, label: state.attributes?.name }
	})

	const restrictions = [
		{ id: 0, name: "Diese Veranstaltung ist ausschließlich für Legionäre" },
		{ id: 1, name: "Diese Veranstaltung ist ausschließlich für Hilfslegionäre" },
		{ id: 2, name: "Diese Veranstaltung ist ausschließlich für Legionäre und Hilfslegionäre" },
		{ id: 3, name: "Diese Veranstaltung ist für alle" },
	]

	const restrictionOptions = restrictions.map(restriction => {
		return { id: restriction.id, value: restriction.name, label: restriction.name }
	})

	console.log({ selectedState })
	console.log({ stateOptions })

	return (
		<article className="container px-4 my-8 mx-auto">
			<h1 className="my-8">Was würden Sie gerne ändern?</h1>
			<form className="grid grid-cols-1 sm:grid-cols-2 items-baseline sm:justify-items-center sm:justify-center mt-8 gap-4">
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="title">Titel: *</label>
					<input className="" id="title" name="title" value={title} required onChange={e => setTitle(e.target.value)} />
				</div>

				<div className="grid grid-cols-1 justify-center mt-4 mb-2">
					<DatePicker
						selected={startTime}
						id="startTime"
						name="startTime"
						timeFormat="HH:mm"
						timeIntervals={15}
						showTimeSelect
						onChange={date => setStartTime(date)}
						minDate={new Date()}
						dateFormat="dd MMMM yyyy | HH:mm"
						placeholderText="Bitte Startdatum auswählen *"
					/>
				</div>

				<div className="grid grid-cols-1 justify-center mt-4 mb-2">
					<DatePicker
						selected={endTime}
						timeFormat="HH:mm"
						timeIntervals={15}
						showTimeSelect
						onChange={date => setEndTime(date)}
						minDate={startTime ? startTime : new Date()}
						dateFormat="dd MMMM yyyy | HH:mm"
						placeholderText="Bitte Enddatum auswählen"
					/>
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="description">Beschreibung: *</label>
					<textarea
						id="description"
						name="description"
						value={description}
						onChange={e => setDescription(e.target.value)}
						className="textarea-class"
						rows={4}
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="street">Straße: *</label>
					<input
						id="street"
						name="street"
						value={arrival.street}
						onChange={e => setArrival({ ...arrival, street: e.target.value })}
						required
						className="input-class"
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="number">Hausnummer:</label>
					<input
						id="number"
						name="number"
						type="number"
						value={arrival.number || ""}
						onChange={e => setArrival({ ...arrival, number: e.target.value })}
						className="input-class"
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="city">Stadt: *</label>
					<input id="city" name="city" value={arrival.city} onChange={e => setArrival({ ...arrival, city: e.target.value })} required className="input-class" />
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="country">Land:</label>
					<input
						id="country"
						name="country"
						value={arrival.country}
						onChange={e => setArrival({ ...arrival, country: e.target.value })}
						className="input-class"
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="organiser">Organisator:</label>
					<input
						id="organiser"
						name="organiser"
						value={arrival.organiser}
						onChange={e => setArrival({ ...arrival, organiser: e.target.value })}
						className="input-class"
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="contactPerson">Kontaktperson:</label>
					<input
						id="contactPerson"
						name="contactPerson"
						value={arrival.contactPerson}
						onChange={e => setArrival({ ...arrival, contactPerson: e.target.value })}
						className="input-class"
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="phone">Telefon:</label>
					<input id="phone" name="phone" value={arrival.phone} onChange={e => setArrival({ ...arrival, phone: e.target.value })} className="input-class" />
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="email">Email:</label>
					<input
						id="email"
						name="email"
						type="email"
						value={arrival.email}
						onChange={e => setArrival({ ...arrival, email: e.target.value })}
						className="input-class"
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="shortDescription">Kurzbeschreibung:</label>
					<textarea
						id="shortDescription"
						name="shortDescription"
						value={arrival.shortDescription}
						onChange={e => setArrival({ ...arrival, shortDescription: e.target.value })}
						className="textarea-class"
						rows={2}
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="addressAddition">Adresszusatz:</label>
					<input
						id="addressAddition"
						name="addressAddition"
						value={arrival.addressAddition}
						onChange={e => setArrival({ ...arrival, addressAddition: e.target.value })}
						className="input-class"
					/>
				</div>
				<div className="grid grid-cols-1 justify-center my-4 sm:min-w-72">
					<Select
						id="unique-select-recurrenceType"
						inputId="unique-select-recurrenceType"
						instanceId="unique-select-recurrenceType"
						placeholder="Serientyp wählen"
						value={recurrenceTypeOptions.find(option => option.value === repeat.recurrenceType)}
						styles={customStyles}
						onChange={option => setRepeat({ ...repeat, recurrenceType: option.value })}
						options={recurrenceTypeOptions}
					/>
				</div>
				<div className="grid grid-cols-1 justify-center mb-2 self-center">
					<div className="hidden sm:block sm:mb-2" />
					<DatePicker
						selected={repeat.recurrenceEndDate}
						timeFormat="HH:mm"
						timeIntervals={15}
						showTimeSelect
						onChange={date => setRepeat({ ...repeat, recurrenceEndDate: date })}
						minDate={new Date()}
						dateFormat="dd MMMM yyyy | HH:mm"
						placeholderText="Enddatum vom Serientermin"
					/>
				</div>

				<div className="grid grid-cols-1 justify-center sm:max-w-72">
					<Select
						id="unique-select-state-id-"
						inputId="unique-select-state-id"
						instanceId="unique-select-state-id"
						placeholder="Teilnehmerbeschränkung"
						styles={customStyles}
						value={restrictionOptions.find(option => option.value === participantRestriction)}
						onChange={setParticipantRestriction}
						options={restrictionOptions}
					/>
				</div>

				<div className="grid grid-cols-1 justify-center sm:min-w-72">
					<Select
						id="unique-select-assignment-id-"
						inputId="unique-select-assignment-id"
						instanceId="unique-select-assignment-id"
						placeholder="Zuordnen"
						styles={customStyles}
						value={assignmentOptions.find(option => option.value === selectedAssignment)}
						onChange={setSelectedAssignment}
						options={assignmentOptions}
					/>
				</div>

				<div className="grid grid-cols-1 justify-center my-4 sm:min-w-72">
					<Select
						id="unique-select-state-id-"
						inputId="unique-select-state-id"
						instanceId="unique-select-state-id"
						placeholder="Bundesland wählen"
						styles={customStyles}
						value={stateOptions.find(option => option.value === selectedState)}
						onChange={setSelectedState}
						options={stateOptions}
					/>
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="isRegistration">Anmeldung erforderlich:</label>
					<input
						id="isRegistration"
						name="isRegistration"
						type="checkbox"
						checked={registration.isRegistration}
						onChange={e => setRegistration({ ...registration, isRegistration: e.target.checked })}
						className="checkbox-class"
					/>
				</div>
				{registration.isRegistration && (
					<div className="grid grid-rows-[26px_1fr] gap-2">
						<label htmlFor="registrationDescription">Beschreibung der Anmeldung:</label>
						<textarea
							id="registrationDescription"
							name="registrationDescription"
							value={registration.registrationDescription}
							onChange={e => setRegistration({ ...registration, registrationDescription: e.target.value })}
							className="textarea-class"
							rows={3}
						/>
					</div>
				)}
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="applicantName">Vorname:</label>
					<input
						id="applicantName"
						name="applicantName"
						value={applicant.name}
						onChange={e => setApplicant({ ...applicant, name: e.target.value })}
						className="input-class"
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="applicantSurname">Nachname:</label>
					<input
						id="applicantSurname"
						name="applicantSurname"
						value={applicant.surname}
						onChange={e => setApplicant({ ...applicant, surname: e.target.value })}
						className="input-class"
					/>
				</div>
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="applicantEmail">Email:</label>
					<input
						id="applicantEmail"
						name="applicantEmail"
						type="email"
						value={applicant.email}
						onChange={e => setApplicant({ ...applicant, email: e.target.value })}
						className="input-class"
					/>
				</div>

				<div className="mt-4 flex flex-col items-center sm:my-12">
					<BaseButton buttonType="submit" isDisabled={loading} text={loading ? "Löschen..." : "Termin Löschen"} />
				</div>
			</form>
		</article>
	)
}

export default EditEvent
