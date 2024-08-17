import IconItems from "./IconItems"

const Separator = () => {
	return (
		<div className="relative h-[1px] bg-primary w-full my-28">
			<IconItems
				baseClass="absolute z-10 right-1/2 transform translate-x-1/2 top-1/2 -translate-y-1/2 bg-white"
				height="2.4rem"
				width="3.4rem"
				type="separator"
				fillColor="hsl(227, 46%, 44%)"
				bgColor="hsl(5, 0%, 100%)"
			/>
		</div>
	)
}

export default Separator
