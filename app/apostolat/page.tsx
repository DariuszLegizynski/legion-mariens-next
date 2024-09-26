import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import Separator from "@/components/base/Separator"
import TitleContent from "@/components/common/TitleContent"
import Links from "@/app/_components/Links"

const Apostolat = async () => {
	const data = await getStrapiData("apostolat?populate[apostolat][populate][titleLinks][populate]=*")
	const mainData = data?.data?.attributes

	const linksData = await getStrapiData("apostolat?populate[links][populate]=*")
	const linksDataContent = linksData?.data?.attributes

	return (
		<article className="my-24 mx-4 max-container">
			<TitleContent title={mainData?.apostolat?.title} content={mainData?.apostolat?.content} />
			<Separator />
			<Links title={mainData?.titleLinks} links={linksDataContent?.links} />
		</article>
	)
}

export default Apostolat
