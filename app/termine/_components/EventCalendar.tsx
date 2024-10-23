"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

import type { Category } from "@/types/Category"

import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker"
import { de } from "date-fns/locale/de"
registerLocale("de", de)
setDefaultLocale("de")
import "react-datepicker/dist/react-datepicker.css"

import Cookies from "js-cookie"

type SetCategoryFn = (value: string) => void
type SetStartDateFn = (value: string) => void
type SetEndDateFn = (value: string) => void
type SetStateFn = (value: string) => void
type SetAssignmentFn = (value: string) => void

const EventCalendar = ({
	categories,
	setCategory,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	states,
	setState,
	assignments,
	setAssignment,
}: {
	categories: Category[]
	setCategory: SetCategoryFn
	startDate: string
	setStartDate: SetStartDateFn
	endDate: string
	setEndDate: SetEndDateFn
	states: Category[]
	setState: SetStateFn
	assignments: Category[]
	setAssignment: SetAssignmentFn
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	const isCookie = Cookies.get("jwt")
	useEffect(() => {
		setIsAuthenticated(Cookies.get("jwt") ? true : false)
	}, [isCookie])

	return (
		<>
			<section className="grid grid-cols-1 justify-items-center gap-4 mt-8 mb-4 md:gap md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr] md:gap-x-8 md:justify-between mx-4">
				<select onChange={e => setCategory(e.target.value)}>
					<option value="Alle Kategorien">Alle Kategorien</option>
					{categories.length > 0 &&
						categories.map(cat => (
							<option key={cat.id} value={cat.attributes?.category}>
								{cat.attributes?.category}
							</option>
						))}
				</select>
				<select onChange={e => setState(e.target.value)}>
					<option value="Alle Bundesländer">Alle Bundesländer</option>
					{states.length > 0 &&
						states.map(state => (
							<option key={state.id} value={state?.attributes?.name}>
								{state?.attributes?.name}
							</option>
						))}
				</select>
				<select onChange={e => setAssignment(e.target.value)} className="md:col-span-2 lg:col-auto">
					<option value="Beides">Beides</option>
					{assignments.length > 0 &&
						assignments.map(assignment => (
							<option key={assignment?.id} value={assignment?.attributes?.name}>
								{assignment?.attributes?.name}
							</option>
						))}
				</select>
			</section>
			<section className="grid grid-cols-1 gap-4 mt-4 mx-4 mb-8 md:gap md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr] md:gap-x-8 md:justify-between">
				<DatePicker
					selected={startDate}
					locale="de"
					onChange={date => setStartDate(date)}
					minDate={new Date()}
					dateFormat="dd MMMM yyyy"
					placeholderText="Startdatum wählen"
				/>
				<DatePicker
					selected={endDate}
					locale="de"
					onChange={date => setEndDate(date)}
					minDate={startDate ? startDate : new Date()}
					dateFormat="dd MMMM yyyy"
					placeholderText="Enddatum wählen"
				/>
				{isAuthenticated && (
					<Link
						href="/fuer-legionaere-mariens/neuer-termin"
						className="md:col-span-2 lg:col-auto bg-green text-center rounded cursor-pointer hover:scale-105 hover:bg-green-dark focus:scale-105 focus:bg-green-dark transition-all ease-in-out"
					>
						<p className="text-white py-2">Neuer Termin</p>
					</Link>
				)}
			</section>
		</>
	)
}

export default EventCalendar
