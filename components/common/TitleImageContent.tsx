import type { Content, Child } from "@/types/LandingPage"
import Image from "next/image"

const TitleImageContent = ({ title, image, content }: { title: string; image: any; content?: Content }) => {
	return (
		<section className="flex flex-col mb-8">
			<div className="h2 my-2.5">{title}</div>
			<div>
				<Image
					className="h-[400px] object-contain my-12 float-left md:h-[560px] lg:h-[640px] md:w-[50%] pr-4"
					src={`${process.env.API_URL}${image?.data?.attributes?.url}`}
					alt={`${process.env.API_URL}/${image?.data?.attributes?.alternativeText}`}
					width={400}
					height={300}
				/>
				<div
					dangerouslySetInnerHTML={{
						__html: content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
					}}
					className="max-w-full text-left mt-4 md:text-justify md:pr-8 [&>p]:pt-6"
				/>
			</div>
		</section>
	)
}

export default TitleImageContent
