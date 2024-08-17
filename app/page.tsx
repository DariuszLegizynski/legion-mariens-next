import Image from "next/image"

// type
import { LandingPageData, Content, Child } from "@/types/LandingPage"

import { getStrapiData } from "@/app/_utils/getStrapiData"

// components
import Separator from "@/components/base/Separator"
import EventComponent from "@/app/_components/event/EventComponent"
import BaseButton from "@/components/base/BaseButton"

export default async function Home() {
	const landingPageData = await getStrapiData(
		"landing-page?populate[introduction][populate][avatar][populate]=true&populate[about][populate]=true&populate[termine][populate]=true"
	)
	const { introduction, about, termine } = await landingPageData.data.attributes

	const today = new Date().toISOString()
	const eventsData = await getStrapiData(`events?filters[startTime][$gte]=${today}&pagination[pageSize]=10&populate=*&sort=startTime:ASC`)
	const events = await eventsData.data

	return (
		<main className="flex min-h-screen flex-col items-center justify-between mx-4 my-20 md:mx-8">
			<div className="md:grid md:grid-cols-2 md:gap-x-16">
				{introduction && (
					<section className="flex flex-col mb-8">
						<div>
							<Image
								src={`${process.env.API_URL}${introduction?.avatar.data.attributes.url}`}
								alt={introduction?.avatar.data.attributes.alternativeText || "Avatar"}
								width={64}
								height={64}
								className="float-left mr-5 rounded-full"
							/>
							<h3 className="my-2.5">{introduction?.title}</h3>
						</div>
						<div
							dangerouslySetInnerHTML={{
								__html: introduction?.content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
							}}
							className="text-left mt-4 grid gap-y-4"
						/>
					</section>
				)}
				{about && (
					<section className="flex flex-col mb-8">
						<div className="h2 my-2.5">{about?.title}</div>
						<div
							dangerouslySetInnerHTML={{
								__html: about?.content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
							}}
							className="text-left mt-4 grid gap-y-4"
						/>
					</section>
				)}
			</div>
			<Separator />
			<div className="md:grid md:grid-cols-2 md:gap-x-16">
				{termine && (
					<section className="flex flex-col mb-8">
						<div className="h2 my-2.5">{termine?.title}</div>
						<div
							dangerouslySetInnerHTML={{
								__html: termine?.content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
							}}
							className="text-left mt-4 grid gap-y-4"
						/>
					</section>
				)}
				<section className="grid grid-cols-1 justify-items-center gap-y-8 mt-8 xl:grid-cols-2 xl:gap-x-8">
					{events.length > 0 ? (
						events.map((eventItem: Event, index) => <EventComponent key={`event_${index}`} eventItem={eventItem} isVisible={true} />)
					) : (
						<p className="mt-16 text-center">Keine Ereignisse für diese Kriterien gefunden.</p>
					)}
					<div className="grid items-center justify-items-center xl:col-span-2 w-full">
						<BaseButton text="Alle Termine" buttonType="accent" linkPath="/termine" />
					</div>
				</section>
			</div>
		</main>
	)
}

