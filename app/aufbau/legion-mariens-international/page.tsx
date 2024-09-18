import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import TitleContent from "@/components/common/TitleContent"

const LegionInternational = async () => {
	const international = await getStrapiData("aufbau-legion-mariens-international?populate[international][populate]=*")
	const internationalData = international.data.attributes

	console.log({ internationalData })

	return (
		<article className="my-24 mx-4 max-container">
			<h1 className="text-left mb-16">{internationalData.title}</h1>
			<section className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
				{internationalData.international.map(internationalItem => (
					<TitleContent key={internationalItem.id} title={internationalItem.title} content={internationalItem.content} headerType="h3" />
				))}
			</section>
		</article>
	)
}

export default LegionInternational
