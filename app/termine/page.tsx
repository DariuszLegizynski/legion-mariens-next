import { getStrapiData } from "@/app/_utils/services/getStrapiData"

import { LandingPageData, Content, Child } from "@/types/LandingPage"
import EventList from "@/app/termine/_components/EventList"

export default async function termine() {
	const appointmentsPageData: LandingPageData = await getStrapiData("termine?populate=*")
	const termine = await appointmentsPageData?.data?.attributes?.content

	return (
		<article className="mt-20 mb-40 max-container">
			<section className="mx-4">
				<h1 className="mb-8">{termine.title}</h1>
				<div
					dangerouslySetInnerHTML={{
						__html: termine.content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
					}}
					className="text-left mt-4 grid gap-y-4"
				/>
			</section>
			<EventList />
		</article>
	)
}
