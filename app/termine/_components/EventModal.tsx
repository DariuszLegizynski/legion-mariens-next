"use client"
import Link from "next/link"

import { Event } from "@/types/Event"
import BaseButton from "@/components/base/BaseButton"

const EventModal = ({ eventItem, onClose }: { eventItem: Event; onClose: () => void }) => {
	if (!eventItem) return null

	const handleModalClick = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	const startTime = new Date(eventItem.attributes?.startTime)
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
			<div className="bg-white m-4 p-6 shadow-lg w-full max-h-full overflow-y-auto z-30" onClick={handleModalClick}>
				<div onClick={onClose} className="flex justify-end">
					<BaseButton buttonType="close" iconType="close" width="2rem" height="2rem" />
				</div>
				<section className="border-l-[3px] border-primary pl-1.5">
					<div className="grid auto-rows-auto md:flex">
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
				</section>
				<section className="my-4">
					<div className="h1 !normal-case">{eventItem.attributes?.title}</div>
					<i>{eventItem?.attributes?.categories?.data?.map(cat => cat.attributes?.category)}</i>
				</section>
				<section>
					<div
						className="mb-6"
						dangerouslySetInnerHTML={{
							__html: eventItem.attributes?.description?.content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
						}}
					/>
					{eventItem.attributes?.description?.registration && <b className="text-primary">Eine Anmeldung ist notwendig.</b>}
					{eventItem.attributes?.description?.registrationDescription && <p className="mt-2">{eventItem.attributes?.description?.registrationDescription}</p>}
				</section>
			</div>
			<div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
		</section>
	)
}

export default EventModal
