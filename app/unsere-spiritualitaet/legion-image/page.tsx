import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import TitleImageContent from "@/components/common/TitleImageContent"

const LegionImage = async () => {
	const data = await getStrapiData("spiritualitaet-legion-image?populate[legion_image][populate][image][populate]=*")
	const legionImage = data.data.attributes.legion_image
	console.log({ legionImage })
	return (
		<article className="my-24 mx-4 grid grid-cols-1 items-center gap-y-16 gap-x-8 max-container sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<TitleImageContent title={legionImage.title} image={legionImage.image} content={legionImage.content} />
		</article>
	)
}

export default LegionImage
