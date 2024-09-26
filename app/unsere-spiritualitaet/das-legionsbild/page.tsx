import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import TitleImageContent from "@/components/common/TitleImageContent"

const LegionImage = async () => {
	const data = await getStrapiData("spiritualitaet-legionsbild?populate[legion_image][populate][image][populate]=*")
	const legionImage = data?.data?.attributes?.legion_image

	return (
		<article className="my-24 mx-4 max-container">
			<TitleImageContent title={legionImage?.title} image={legionImage?.image} content={legionImage?.content} />
		</article>
	)
}

export default LegionImage
