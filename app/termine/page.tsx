import EventList from "@/components/event/EventList"
import Layout from "@/app/layout"

async function getAppointmentsPageData() {
	try {
		const response = await fetch(`${process.env.API_URL}/api/termine?populate=*`)
		const data = await response.json()
		console.log(data)
		return data
	} catch (error) {
		console.error(error)
	}
}

export default async function termine() {
	const appointmentsPageData = await getAppointmentsPageData()
	const { termine } = await appointmentsPageData.data.attributes

	return (
		<Layout>
			<article className="mt-20 mb-40 max-container">
				{/* <section className="mx-4">
					<h1 className="mb-8">{termine.title}</h1>
					<div
						dangerouslySetInnerHTML={{
							__html: termine.content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
						}}
						className="text-left mt-4 grid gap-y-4"
					/>
				</section>
				<EventList /> */}
			</article>
		</Layout>
	)
}
