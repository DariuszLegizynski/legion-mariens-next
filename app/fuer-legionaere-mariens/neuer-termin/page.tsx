"use client"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import BaseButton from "@/components/base/BaseButton"
import { createStrapiAuthData, getStrapiData } from "@/app/_utils/services/getStrapiData"
import Select from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const CreateEvent = () => {
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
	const [assignments, setAssignments] = useState([])
	const [states, setStates] = useState([])
	const [selectedCategories, setSelectedCategories] = useState([])
	const [selectedAssignment, setSelectedAssignment] = useState([])
	const [selectedState, setSelectedState] = useState([])
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

	console.log({ selectedAssignment })

	const handleCreateEvent = async () => {
		setRequest({ ...request, loading: true })

		const eventData = {
			data: {
				title,
				categories: selectedCategories.map(category => category.id),
				startTime,
				endTime,
				event_assignment: selectedAssignment.id,
				description,
				arrival,
				event_state: selectedState.id,
				repeat: isRecurrent
					? {
							recurrenceType: repeat.recurrenceType || null,
							recurrenceEndDate: repeat.recurrenceEndDate || null,
					  }
					: null,
				participantRestriction: participantRestriction?.value,
				registration,
				publishedAt: null,
				applicant,
			},
		}

		try {
			await createStrapiAuthData("events", eventData, jwt)
			setRequest({ ...request, loading: false, complete: true })
		} catch (error) {
			setRequest({ ...request, loading: false, error: error.message })
		}
	}

	const categoriesOptions = categories.map(category => {
		return { id: category.id, value: category?.attributes?.category, label: category.attributes?.category }
	})

	const assignmentOptions = assignments.map(assignment => {
		return { id: assignment.id, value: assignment?.attributes?.name, label: assignment.attributes?.name }
	})

	const stateOptions = states.map(state => {
		return { id: state.id, value: state.attributes.name, label: state.attributes?.name }
	})

	const recurrenceTypes = [
		{ id: 0, name: "Wöchentlich", value: "weekly" },
		{ id: 1, name: "Monatlich", value: "monthly" },
		{ id: 2, name: "Jährlich", value: "yearly" },
	]

	const recurrenceTypeOptions = recurrenceTypes.map(recurrenceType => {
		return { id: recurrenceType.id, value: recurrenceType.value, label: recurrenceType.name }
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

	useEffect(() => {
		const fetchCategories = async () => {
			const response = await getStrapiData("categories?populate=*&sort=category:ASC")
			setCategories(response.data)
		}
		fetchCategories()

		const fetchStates = async () => {
			const response = await getStrapiData("event-states?populate=*")
			setStates(response.data)
		}
		fetchStates()

		const fetchAssignments = async () => {
			const response = await getStrapiData("event-assignments?populate=*")
			setAssignments(response.data)
		}
		fetchAssignments()
	}, [])

	return (
		<article className="my-24 max-container mx-4">
			<h1 className="text-center">Neuen Termin erstellen</h1>
			<form className="grid grid-cols-1 sm:grid-cols-2 items-baseline sm:justify-items-center sm:justify-center mt-8 gap-4">
				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="title">Titel: *</label>
					<input className="" id="title" name="title" required onChange={e => setTitle(e.target.value)} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="description">Termin Beschreibung:</label>
					<textarea className="" id="description" name="description" onChange={e => setDescription(e.target.value)} />
				</div>

				<div className="grid grid-cols-1 justify-center mt-4 mb-2">
					<DatePicker
						selected={startTime}
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

				<div className="grid grid-cols-1 my-4 sm:min-w-72">
					<Select
						id="unique-select-categories-id-"
						inputId="unique-select-categories-id"
						instanceId="unique-select-categories-id"
						isMulti
						placeholder="Kategorie(n) wählen:"
						closeMenuOnSelect={false}
						styles={customStyles}
						defaultValue={selectedCategories}
						onChange={setSelectedCategories}
						options={categoriesOptions}
					/>
				</div>

				<div className="grid grid-cols-1 sm:min-w-72">
					<Select
						id="unique-select-assignment-id-"
						inputId="unique-select-assignment-id"
						instanceId="unique-select-assignment-id"
						placeholder="Zuordnen"
						styles={customStyles}
						defaultValue={selectedAssignment}
						onChange={setSelectedAssignment}
						options={assignmentOptions}
					/>
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="street">Straße: *</label>
					<input className="" type="text" id="street" required onChange={e => setArrival({ ...arrival, street: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="number">Hausnummer:</label>
					<input className="" type="number" id="number" onChange={e => setArrival({ ...arrival, number: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="city">Stadt: *</label>
					<input className="" type="text" id="city" required onChange={e => setArrival({ ...arrival, city: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="country">Land:</label>
					<input className="" type="text" id="country" onChange={e => setArrival({ ...arrival, country: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="organiser">Organisator:</label>
					<input className="" type="text" id="organiser" onChange={e => setArrival({ ...arrival, organiser: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="contactPerson">Ansprechpartner:</label>
					<input className="" type="text" id="contactPerson" onChange={e => setArrival({ ...arrival, contactPerson: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="phone">Telefonnummer:</label>
					<input className="" type="text" id="phone" onChange={e => setArrival({ ...arrival, phone: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="email">Email:</label>
					<input className="" type="email" id="email" onChange={e => setArrival({ ...arrival, email: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="shortDescription">Kurzbeschreibung:</label>
					<input className="" type="text" id="shortDescription" onChange={e => setArrival({ ...arrival, shortDescription: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="addressAddition">Zusatz:</label>
					<input className="" type="text" id="addressAddition" onChange={e => setArrival({ ...arrival, addressAddition: e.target.value })} />
				</div>

				<div className="grid grid-cols-1 justify-center my-4 sm:min-w-72">
					<Select
						id="unique-select-state-id-"
						inputId="unique-select-state-id"
						instanceId="unique-select-state-id"
						placeholder="Bundesland wählen"
						styles={customStyles}
						defaultValue={selectedState}
						onChange={setSelectedState}
						options={stateOptions}
					/>
				</div>

				<div className="grid grid-cols-1 justify-center sm:min-w-72">
					<Select
						id="unique-select-state-id-"
						inputId="unique-select-state-id"
						instanceId="unique-select-state-id"
						placeholder="Teilnehmerbeschränkung"
						styles={customStyles}
						defaultValue={participantRestriction}
						onChange={setParticipantRestriction}
						options={restrictionOptions}
					/>
				</div>

				<div className="grid grid-cols-[1fr_16px] mt-4 sm:mt-0 sm:min-w-72">
					<label className="text-nowrap" htmlFor="isRecurrent">
						Ist ein Serientermin? *
					</label>
					<input type="checkbox" id="isRecurrent" checked={isRecurrent} onChange={e => setIsRecurrent(e.target.checked)} />
				</div>

				{isRecurrent ? (
					<>
						<div className="hidden sm:block" />

						<div className="grid grid-cols-1 justify-center my-4 sm:min-w-72">
							<Select
								id="unique-select-recurrenceType"
								inputId="unique-select-recurrenceType"
								instanceId="unique-select-recurrenceType"
								placeholder="Serientyp wählen"
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
					</>
				) : (
					<div />
				)}

				<div className="grid grid-cols-[1fr_16px] sm:mt-4 sm:min-w-72">
					<label className="text-nowrap" htmlFor="isRegistration">
						Anmeldung erforderlich? *
					</label>
					<input
						type="checkbox"
						id="isRegistration"
						checked={registration.isRegistration}
						onChange={e => setRegistration({ ...registration, isRegistration: e.target.checked })}
					/>
				</div>

				{registration.isRegistration ? (
					<div className="grid grid-cols-1 justify-center sm:mt-4 mb-2">
						<label htmlFor="registrationDescription">Registrierungsbeschreibung:</label>
						<textarea
							className=""
							id="registrationDescription"
							name="registrationDescription"
							onChange={e => setRegistration({ ...registration, registrationDescription: e.target.value })}
						/>
					</div>
				) : (
					<div />
				)}

				<div className="grid grid-rows-[26px_1fr_1fr] gap-2 mt-2 sm:mt-8">
					<label htmlFor="applicant-name">Termin Erstellt von:</label>
					<input className="" type="text" id="applicant-name" placeholder="Vorame" onChange={e => setApplicant({ ...applicant, name: e.target.value })} />
					<input className="" type="text" id="surname" placeholder="Zuname" onChange={e => setApplicant({ ...applicant, surname: e.target.value })} />
				</div>

				<div className="grid grid-rows-[26px_1fr] gap-2">
					<label htmlFor="applicantEmail">Email:</label>
					<input className="" type="email" id="applicantEmail" onChange={e => setApplicant({ ...applicant, email: e.target.value })} />
				</div>

				<div className="col-span-full mx-auto mt-12">
					{!request.error && !request.complete && (
						<BaseButton onClick={handleCreateEvent} isDisabled={request.loading || request.error} buttonType="submit" text="Neuen Termin erstellen" />
					)}
					{request.error && <p>{request.error}</p>}
					{request.complete && <p>Anfrage gesendet.</p>}
				</div>
			</form>
		</article>
	)
}

export default CreateEvent
