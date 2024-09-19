import Image from "next/image"

const TitleImage = ({ title, image, width, height }: { title: string; image: any; width: number; height: number }) => {
	return (
		<section className="flex flex-col mb-8">
			<h1 className="my-2.5">{title}</h1>
			<Image
				className={`w-auto object-contain mx-auto my-12`}
				src={`${process.env.API_URL}${image?.data?.attributes?.url}`}
				alt={`${process.env.API_URL}/${image?.data?.attributes?.alternativeText}`}
				width={width}
				height={height}
			/>
		</section>
	)
}

export default TitleImage
