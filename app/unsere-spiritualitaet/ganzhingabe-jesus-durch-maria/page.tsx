import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import Separator from "@/components/base/Separator"
import TitleContent from "@/components/common/TitleContent"

const GanzhingabeMaria = async () => {
	const data = await getStrapiData("spiritualitaet-ganzhingabe-jesus-durch-maria?populate=*")
	const totalDedicationData = data.data.attributes

	return (
		<article className="my-24 mx-4 max-container">
			<h1 className="pb-8">{totalDedicationData.title}</h1>
			{totalDedicationData.dedication?.map((item, index) => (
				<>
					<TitleContent key={index} title={item?.title} content={item?.content} />
					{index < totalDedicationData.dedication.length - 1 && <Separator />}
				</>
			))}
		</article>
	)
}

export default GanzhingabeMaria
