import type { Content, Child } from "@/types/LandingPage"

const TitleContent = ({ title, content }: { title: string; content?: Content }) => {
	return (
		<section className="flex flex-col mb-8">
			<div className="h2 my-2.5">{title}</div>
			<div
				dangerouslySetInnerHTML={{
					__html: content?.map((item: Content) => item.children.map((child: Child) => child.text).join("")).join(""),
				}}
				className="text-left mt-4 grid gap-y-4"
			/>
		</section>
	)
}

export default TitleContent
