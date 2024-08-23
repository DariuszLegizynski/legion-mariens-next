const MarkerOverlay = ({ presidium }: { presidium: any }) => {
	return (
		<section className="bg-white w-[210px] pt-1.5 px-3 pb-3 rounded-xl">
			<div className="h3 pb-2">{presidium.title}</div>
			<p>
				{presidium.address} {presidium.city}
			</p>
		</section>
	)
}

export default MarkerOverlay
