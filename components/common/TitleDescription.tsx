const TitleImageContent = ({ title, description }: { title: string; description: string }) => {
	return (
		<section className="flex flex-col mb-8">
			<h3 className="my-2.5">{title}</h3>
			<p className="text-left mt-4 grid gap-y-4">{description}</p>
		</section>
	)
}

export default TitleImageContent
