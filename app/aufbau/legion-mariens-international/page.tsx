import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import TitleContent from "@/components/common/TitleContent"
import WorldMapLegion from "./_components/WorldMapLegion"

const LegionInternational = async () => {
	const international = await getStrapiData("aufbau-legion-mariens-international?populate[international][populate]=*")
	const internationalData = international?.data?.attributes

	return (
		<article className="my-24 max-container">
			<section className="mx-4">
				<h1 className="text-left mb-16">{internationalData.title}</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
					{internationalData.international.map(internationalItem => (
						<TitleContent key={internationalItem.id} title={internationalItem.title} content={internationalItem.content} headerType="h3" />
					))}
				</div>
			</section>

			<section className="bg-grey-light w-screen h-auto pt-12">
				<div className="grid gap-y-4 pl-8 pb-12">
					<div className="flex items-center gap-x-2">
						<div className="size-4 bg-accent" />
						<span>Vom Senatus Österreich mitbetreute Länder</span>
					</div>
					<div className="flex items-center gap-x-2">
						<div className="size-4 bg-blue" />
						<span>Länder in denen die Legion Mariens vertreten ist.</span>
					</div>
					<div className="flex items-center gap-x-2">
						<div className="size-4 bg-white" />
						<span>Vom Senatus Österreich mitbetreute Länder</span>
					</div>
				</div>
				<div className="">
					<WorldMapLegion width="100%" height="100%" />
				</div>
			</section>
		</article>
	)
}

export default LegionInternational
