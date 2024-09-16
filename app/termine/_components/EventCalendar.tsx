"use client"
import type { Category } from "@/types/Category"

type SetCategoryFn = (value: string) => void
type SetStartDateFn = (value: string) => void
type SetEndDateFn = (value: string) => void
type SetStateFn = (value: string) => void
type SetAssignmentFn = (value: string) => void

const EventCalendar = ({
	categories,
	setCategory,
	setStartDate,
	setEndDate,
	states,
	setState,
	assignments,
	setAssignment,
}: {
	categories: Category[]
	setCategory: SetCategoryFn
	setStartDate: SetStartDateFn
	setEndDate: SetEndDateFn
	states: Category[]
	setState: SetStateFn
	assignments: Category[]
	setAssignment: SetAssignmentFn
}) => {
	return (
		<>
			<section className="grid grid-cols-1 justify-items-center gap-4 my-8 md:gap md:grid-cols-[1fr_1fr_1fr] md:gap-x-8 md:justify-between mx-4">
				<select onChange={e => setCategory(e.target.value)}>
					<option value="Alle Kategorien">Alle Kategorien</option>
					{categories.length > 0 &&
						categories.map(cat => (
							<option key={cat.id} value={cat.attributes?.category}>
								{cat.attributes?.category}
							</option>
						))}
				</select>
				<input type="date" onChange={e => setStartDate(new Date(e.target.value).toISOString())} />
				<input type="date" onChange={e => setEndDate(new Date(e.target.value).toISOString())} />
			</section>
			<section className="grid grid-cols-1 justify-items-center gap-4 my-8 md:gap md:grid-cols-[1fr_1fr_1fr] md:gap-x-8 md:justify-between mx-4">
				<select onChange={e => setState(e.target.value)}>
					<option value="Alle Bundesländer">Alle Bundesländer</option>
					{states.length > 0 &&
						states.map(state => (
							<option key={state.id} value={state?.attributes?.name}>
								{state?.attributes?.name}
							</option>
						))}
				</select>
				<select onChange={e => setAssignment(e.target.value)}>
					<option value="Beides">Beides</option>
					{assignments.length > 0 &&
						assignments.map(assignment => (
							<option key={assignment?.id} value={assignment?.attributes?.name}>
								{assignment?.attributes?.name}
							</option>
						))}
				</select>
			</section>
		</>
	)
}

export default EventCalendar
