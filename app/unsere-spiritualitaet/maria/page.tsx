import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import Separator from "@/components/base/Separator"
import TitleContent from "@/components/common/TitleContent"
import Links from "@/app/_components/Links"

const Maria = async () => {
	const data = await getStrapiData("spiritualitaet-maria?populate=*")
	const mariaContentData = data.data.attributes.maria

	const archiveData = await getStrapiData("spiritualitaet-maria?populate[links][populate]=*")
	const archiveContentData = archiveData.data.attributes

	console.log({ mariaContentData, archiveContentData })

	return (
		<article className="my-24 mx-4 max-container">
			<TitleContent title={mariaContentData?.title} content={mariaContentData?.content} />
			<Separator />
			<Links title={archiveContentData?.title} links={archiveContentData?.links} />
		</article>
	)
}

export default Maria
