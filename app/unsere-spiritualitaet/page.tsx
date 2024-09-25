import TitleContent from "@/components/common/TitleContent"
import { getStrapiData } from "@/app/_utils/services/getStrapiData"

const OurSpirituality = async () => {
	const data = await getStrapiData("unsere-spiritualitaet?populate=*")
	const ourSpirituality = data.data.attributes.content

	return (
		<article className="my-24 mx-4 max-container">
			{ourSpirituality.map(spirit => (
				<TitleContent key={spirit.id} title={spirit.title} content={spirit?.content} />
			))}
		</article>
	)
}

export default OurSpirituality
