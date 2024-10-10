import type { Content, Child } from "@/types/LandingPage"

const TitleContent = ({ title, content, headerType = "h2" }: { title: string; content?: Content; headerType?: string }) => {
	return (
		<section className="flex flex-col mb-8">
			<div className={`my-2.5 ${headerType}`}>{title}</div>
			<div
				dangerouslySetInnerHTML={{
					__html: content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
				}}
				className="text-left mt-4"
			/>
		</section>
	)
}

export default TitleContent
