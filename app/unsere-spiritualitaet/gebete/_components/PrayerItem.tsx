import Image from "next/image"
import BaseButton from "@/components/base/BaseButton"

const PrayerItem = ({ prayerItem }) => {
	return (
		<div>
			<div className={`grid ${prayerItem.image.data ? "sm:grid-cols-[auto_1fr] gap-x-8" : "mb-16"}`}>
				{prayerItem && prayerItem.image && prayerItem.image.data && (
					<Image
						className="mb-8 w-40 mx-auto"
						src={`${process.env.API_URL}${prayerItem?.image?.data?.attributes?.url}`}
						alt={`${process.env.API_URL}/${prayerItem?.image?.data?.attributes?.alt}`}
						width={150}
						height={300}
					/>
				)}
				<div>
					<i>{prayerItem.prayerCategory?.data?.attributes?.name}</i>
					<h2>{prayerItem.title}</h2>
					<div
						className={`mt-6 ${prayerItem.pdf.data ? "mb-8" : "mb-16 xl:mb-4"}`}
						dangerouslySetInnerHTML={{
							__html: prayerItem.content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
						}}
					/>
				</div>
			</div>
			{prayerItem.pdf.data && (
				<div className="mb-16 flex flex-col w-full items-center sm:items-end">
					<BaseButton buttonType="download" text="download PDF" linkPath={`${process.env.API_URL}${prayerItem?.pdf?.data?.attributes?.url}`}>
						Download PDF
					</BaseButton>
				</div>
			)}
		</div>
	)
}

export default PrayerItem
