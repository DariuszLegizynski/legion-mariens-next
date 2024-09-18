import { getStrapiData } from "@/app/_utils/services/getStrapiData"
import Image from "next/image"

const Prayer = async () => {
	const data = await getStrapiData("spiritualitaet-weihe-an-maria-und-33-schritte?populate[content][populate]=*")
	const dedication = data.data.attributes.content

	return (
		<article className="my-24 mx-4 grid grid-cols-1 items-center gap-y-16 gap-x-8 max-container sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{dedication?.map(item => (
				<a
					className="text-primary hover:text-accent border-b-2 border-primary flex flex-col items-center transition-colors duration-300"
					href={`${process.env.API_URL}${item.pdf.data.attributes.url}`}
					key={item.id}
				>
					<Image
						className="h-80 w-full object-contain mx-auto"
						src={`${process.env.API_URL}${item?.cover?.data?.attributes?.url}`}
						alt={`${process.env.API_URL}/${item?.cover?.data?.attributes?.alternativeText}`}
						width={600}
						height={400}
					/>
					<i className="text-center uppercase py-4">{item.title}</i>
				</a>
			))}
		</article>
	)
}

export default Prayer
