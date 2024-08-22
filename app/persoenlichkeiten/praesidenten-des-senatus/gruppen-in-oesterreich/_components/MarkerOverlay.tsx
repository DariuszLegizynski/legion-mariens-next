import BaseButton from "@/components/base/BaseButton"
import React from "react"

const MarkerOverlay = ({ selected, onClose }: { selected: any; onClose: () => void }) => {
	return (
		<section className="bg-white w-[180px] pt-1.5 px-3 pb-3 rounded-xl">
			<div className="flex justify-end ">
				<BaseButton onClick={onClose} buttonType="close" iconType="close" width="1.8rem" height="1.8rem" />
			</div>
			<div className="pr-1.5">
				<div className="h3">{selected.title}</div>
				<p>
					{selected.address} {selected.city}
				</p>
			</div>
		</section>
	)
}

export default MarkerOverlay
