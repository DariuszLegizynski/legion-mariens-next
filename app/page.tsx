import Image from "next/image"

// type
import { LandingPageData } from "@/types/LandingPage"

import { getStrapiData } from "@/app/_utils/services/getStrapiData"

// components
import Separator from "@/components/base/Separator"
import EventComponent from "@/app/termine/_components/EventComponent"
import BaseButton from "@/components/base/BaseButton"
import { fetchEvents } from "@/app/_components/EventFetcher"
import TitleContent from "@/components/common/TitleContent"

export default async function Home() {
	const landingPageData: LandingPageData = await getStrapiData(
		"landing-page?populate[introduction][populate][image][populate]=true&populate[about][populate]=true&populate[termine][populate]=true"
	)

	const { introduction, about, termine } = await landingPageData.data?.attributes

	const events = await fetchEvents()

	return (
		<main className="flex min-h-screen flex-col items-center justify-between mx-4 my-20 md:mx-8 xl:mx-0">
			<div className="md:grid md:grid-cols-2 md:gap-x-16">
				{introduction && (
					<section className="flex flex-col mb-8">
						<div className="flex items-center">
							<Image
								src={`${process.env.API_URL}${introduction?.image.data?.attributes?.url}`}
								alt={introduction?.image.data?.attributes?.alternativeText || "Avatar"}
								width={64}
								height={64}
								className="float-left mr-5 rounded-full"
							/>
							<h3 className="my-2.5">{introduction?.title}</h3>
						</div>
						<div
							dangerouslySetInnerHTML={{
								__html: introduction?.content?.map(item => item.children.map(child => child.text).join("")).join(""),
							}}
							className="text-left mt-4 grid gap-y-4"
						/>
					</section>
				)}
				{about && <TitleContent title={about?.title} content={about?.content} />}
			</div>
			<Separator />
			<div className="md:grid md:grid-cols-2 md:gap-x-8">
				{termine && <TitleContent title={termine?.title} content={termine?.content} />}

				<section className="grid grid-cols-1 justify-items-center gap-y-8 mt-8 xl:grid-cols-2 xl:gap-x-8">
					{events.length > 0 ? (
						events.slice(0, 6).map((eventItem, index) => <EventComponent key={`event_${index}`} eventItem={eventItem} isVisible={true} />)
					) : (
						<p className="mt-16 text-center">Keine Ereignisse gefunden.</p>
					)}

					<div className="grid items-center justify-items-center xl:col-span-2 w-full">
						<BaseButton text="Alle Termine" buttonType="accent" linkPath="/termine" />
					</div>
				</section>
			</div>
		</main>
	)
}
