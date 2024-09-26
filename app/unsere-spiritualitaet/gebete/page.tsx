import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import PrayerList from "./_components/PrayerList"
import Separator from "@/components/base/Separator"

const Prayer = async () => {
	const data = await getStrapiData("spiritualitaet-gebete?populate[content][populate][content][populate]=*")
	const prayerContentData = data?.data?.attributes

	return (
		<article className="my-24 mx-4 max-container">
			<h1>{prayerContentData.title}</h1>

			{prayerContentData.content?.map((item, index) => (
				<div className="mt-24" key={`PrayerList_${index}`}>
					<PrayerList content={item?.content} />
					{index < prayerContentData?.content?.length - 1 && <Separator />}
				</div>
			))}
		</article>
	)
}

export default Prayer
