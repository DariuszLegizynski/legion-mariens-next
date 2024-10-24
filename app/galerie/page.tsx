import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import Links from "@/app/_components/Links"

const Mediathek = async () => {
	const mediathekData = await getStrapiData("galerie?populate[links][populate]=*")
	const mediathekContentData = mediathekData?.data?.attributes

	console.log({ mediathekContentData })

	return (
		<article className="my-24 mx-4 max-container">
			<Links title={mediathekContentData?.title} links={mediathekContentData?.links} />
		</article>
	)
}

export default Mediathek
