"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Event } from "@/types/Event"
import BaseButton from "@/components/base/BaseButton"
import { Child, Content } from "@/types/LandingPage"
import IconItems from "@/components/base/IconItems"

const EventModal = ({ eventItem, onClose, isAuth }: { eventItem: Event; onClose: () => void; isAuth: boolean }) => {
	if (!eventItem) return null
	const [showDeleteOptions, setShowDeleteOptions] = useState(false)
	const [showEditOptions, setShowEditOptions] = useState(false)
	const router = useRouter()

	const handleDeleteRedirect = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (eventItem?.attributes?.repeat) {
			setShowDeleteOptions(true)
			setShowEditOptions(false)
			return
		}

		handleDeleteSingleEventAndRecurringEvent()
	}

	const handleDeleteSingleEventAndRecurringEvent = () => {
		router.push(`/termine/delete/${eventItem.id}`)
	}

	const handleDeleteSingleOcurrence = (startTime: string) => {
		sessionStorage.setItem("deleteSingleStartTime", startTime)
		router.push(`/termine/delete/${eventItem.id}`)
	}

	const stepBack = (e: React.MouseEvent) => {
		e.stopPropagation()
		setShowDeleteOptions(false)
		setShowEditOptions(false)
	}

	const handleModalClick = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	const handleEditSingleEventAndRecurringEvent = () => {
		router.push(`/termine/edit/${eventItem.id}`)
	}

	const handleEditSingleOcurrence = (startTime: string, occurrenceId: string) => {
		sessionStorage.setItem("editSingleStartTime", startTime)
		sessionStorage.setItem("editSingleOccurrenceId", occurrenceId)
		router.push(`/termine/edit/${eventItem.id}`)
	}

	const handleEditRedirect = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (eventItem?.attributes?.repeat) {
			setShowEditOptions(true)
			setShowDeleteOptions(false)
			return
		}

		handleEditSingleEventAndRecurringEvent()
	}

	let startTime = new Date(eventItem.attributes?.startTime)
	const startDate = startTime.toLocaleDateString("de-DE", {
		day: "numeric",
		month: "long",
		year: "numeric",
	})

	let endDate: string | undefined

	if (eventItem.attributes?.endTime) {
		const endTime = new Date(eventItem.attributes?.endTime)
		endDate = endTime.toLocaleDateString("de-DE", {
			day: "numeric",
			month: "long",
			year: "numeric",
		})
	}

	return (
		<section className="fixed inset-0 flex items-center justify-center z-20" onClick={onClose}>
			<div className="bg-white mx-4 px-6 py-16 shadow-lg w-auto max-h-full overflow-y-auto z-30 xs:py-6" onClick={handleModalClick}>
				<div onClick={onClose} className="flex justify-end items-center gap-x-1 pb-4">
					{isAuth && <BaseButton onClick={handleEditRedirect} buttonType="close" iconType="edit" width="1.2rem" height="1.2rem" />}
					<div className="pr-1" />
					{isAuth && <BaseButton onClick={handleDeleteRedirect} buttonType="close" iconType="delete" width="1.2rem" height="1.2rem" />}
					<BaseButton buttonType="close" iconType="close" width="2rem" height="2rem" />
				</div>
				{showDeleteOptions || showEditOptions ? (
					<div className="flex flex-col items-center">
						<p className="mb-4">
							Wollen sie die ganze Serie {showDeleteOptions && `löschen`}
							{showEditOptions && `bearbeiten`} oder nur diesen Termin?
						</p>
						<div className="flex flex-col gap-4">
							{showDeleteOptions && (
								<>
									<div onClick={() => handleDeleteSingleOcurrence(startTime)} className="cursor-pointer flex gap-x-4 items-center scale-on-hover">
										<IconItems type="remove" width="1.2rem" height="1.2rem" />
										<p>Diesen Termin löschen</p>
									</div>
									<div onClick={handleDeleteSingleEventAndRecurringEvent} className="cursor-pointer flex gap-x-4 items-center scale-on-hover">
										<IconItems type="remove-multiple" width="1.2rem" height="1.2rem" />
										<p>Ganze Serie löschen</p>
									</div>
								</>
							)}
							{showEditOptions && (
								<>
									<div
										onClick={() => handleEditSingleOcurrence(startTime, eventItem?.attributes?.occurrenceId)}
										className="cursor-pointer flex gap-x-2 items-center scale-on-hover"
									>
										<IconItems type="edit" width="1.2rem" height="1.2rem" />
										<p>Diesen Termin bearbeiten</p>
									</div>
									<div onClick={handleEditSingleEventAndRecurringEvent} className="cursor-pointer flex gap-x-2 items-center scale-on-hover">
										<IconItems type="edit-multiple" fillColor="#000" width="1.4rem" height="1.4rem" />
										<p>Ganze Serie bearbeiten</p>
									</div>
								</>
							)}
							<div onClick={stepBack} className="cursor-pointer flex gap-x-2 items-center self-center scale-on-hover pt-2">
								<IconItems type="back" fillColor="#000" width="1.4rem" height="1.4rem" />
								Zurück
							</div>
						</div>
					</div>
				) : (
					<section className="grid md:grid-cols-2">
						<div className="border-l-[3px] border-primary pl-1.5 md:border-l-0 md:grid md:grid-cols-1 md:justify-items-end md:pr-8">
							<div className="grid auto-rows-auto grid-cols-1">
								<p className="text-[1.375rem] text-primary mb-1.5">{startDate}</p>
								{endDate && <p className="text-[1.375rem] text-primary mb-1.5">&nbsp;- {endDate}</p>}
							</div>
							<p>
								{eventItem.attributes?.arrival?.street} {eventItem.attributes?.arrival?.number}
								{eventItem.attributes?.arrival?.addressAddition}
							</p>
							<p>
								{eventItem.attributes?.arrival?.city}, {eventItem.attributes?.arrival?.country}
							</p>
							<i className="normal-case">{eventItem.attributes?.arrival?.shortDescription}</i>
							<p>
								<b>Veranstalter: </b>
								{eventItem.attributes?.arrival?.organiser}
							</p>
							<p>
								<b>Kontaktperson: </b>
							</p>
							<p>{eventItem.attributes?.arrival?.contactPerson}</p>
							<p>
								<Link href={`tel:${eventItem.attributes?.arrival?.phone}`}>{eventItem.attributes?.arrival?.phone}</Link>
							</p>
							<p>
								<Link href={`mailto:${eventItem.attributes?.arrival?.email}`}>{eventItem.attributes?.arrival?.email}</Link>
							</p>
						</div>
						<div className="py-4 md:border-primary md:border-l-[3px] md:pl-6 md:h-fit md:py-0">
							<div className="h1 !normal-case">{eventItem.attributes?.title}</div>
							<i>{eventItem?.attributes?.categories?.data?.map(cat => cat.attributes?.category)}</i>
							<div
								className="mb-6"
								dangerouslySetInnerHTML={{
									__html: eventItem.attributes?.description?.content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
								}}
							/>
							{eventItem.attributes?.description?.registration && <b className="text-primary">Eine Anmeldung ist notwendig.</b>}
							{eventItem.attributes?.description?.registrationDescription && (
								<p className="mt-2">{eventItem.attributes?.description?.registrationDescription}</p>
							)}
						</div>
					</section>
				)}
			</div>
			<div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
		</section>
	)
}

export default EventModal
