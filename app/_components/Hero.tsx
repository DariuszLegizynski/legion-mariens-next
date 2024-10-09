import Image from "next/image"
import Link from "next/link"
import { getStrapiData } from "@/app/_utils/services/getStrapiData"

const Hero = async () => {
	const heroData = await getStrapiData("main-layout?populate[hero][populate]=*")
	const { leftImage, centerImage, rightImage } = await heroData?.data?.attributes?.hero[0]

	return (
		<section className="flex flex-col items-center justify-items-center gap-y-4 mt-12 mx-4 md:grid md:grid-cols-[5fr_2fr_5fr] md:gap-x-8 md:mt-20">
			{leftImage?.data?.attributes && (
				<Link href="/">
					<Image
						className="max-w-[400px] w-full min-h-24"
						src={`${process.env.API_URL}${leftImage?.data?.attributes?.url}`}
						alt={`${process.env.API_URL}/${leftImage?.data?.attributes?.alternativeText}`}
						width={400}
						height={200}
					/>
				</Link>
			)}
			{centerImage?.data?.attributes && (
				<Link href="/unsere-spiritualitaet/das-legionsbild">
					<Image
						className="max-w-[400px] w-full md:max-w-[640px] cursor-pointer"
						src={`${process.env.API_URL}${centerImage?.data?.attributes?.url}`}
						alt={`${process.env.API_URL}/${centerImage?.data?.attributes?.alternativeText}`}
						width={400}
						height={600}
					/>
				</Link>
			)}
			{rightImage?.data?.attributes && (
				<Image
					className="hidden max-w-[400px] w-full md:block"
					src={`${process.env.API_URL}${rightImage?.data?.attributes?.url}`}
					alt={`${process.env.API_URL}/${rightImage?.data?.attributes?.alternativeText}`}
					width={400}
					height={200}
				/>
			)}
		</section>
	)
}

export default Hero
