import type { Content, Child } from "@/types/LandingPage"
import Image from "next/image"

const TitleImageContent = ({ title, image, content }: { title: string; image: any; content?: Content }) => {
	return (
		<section className="flex flex-col mb-8">
			<div className="h2 my-2.5">{title}</div>
			<Image
				className="h-80 w-full object-contain mx-auto my-12"
				src={`${process.env.API_URL}${image?.data?.attributes?.url}`}
				alt={`${process.env.API_URL}/${image?.data?.attributes?.alternativeText}`}
				width={600}
				height={400}
			/>
			<div
				dangerouslySetInnerHTML={{
					__html: content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
				}}
				className="text-left mt-4 grid gap-y-4"
			/>
		</section>
	)
}

export default TitleImageContent
