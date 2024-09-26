import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import TitleDescription from "@/components/common/TitleDescription"
import TitleImage from "@/components/common/TitleImage"

const StrukturLegion = async () => {
	const organigram = await getStrapiData("aufbau-struktur-der-legion-marien?populate[organigram][populate]=*")
	const organigramData = organigram?.data?.attributes?.organigram

	const descriptions = await getStrapiData("aufbau-struktur-der-legion-marien?populate[descriptions][populate]=*")
	const descriptionsData = descriptions?.data?.attributes

	return (
		<article className="my-24 mx-4 max-container">
			<TitleImage title={organigramData?.title} image={organigramData?.image} width={815} height={752} />
			<section className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
				{descriptionsData.descriptions.map(description => (
					<TitleDescription key={description.id} title={description.title} description={description.description} />
				))}
			</section>
		</article>
	)
}

export default StrukturLegion
