import Link from "next/link"

import IconItems from "@/components/base/IconItems"

interface BaseButtonProps {
	buttonType?: string
	iconType?: string
	text?: string
	width?: string
	height?: string
	linkPath?: string
	isDisabled?: boolean
	fillColor?: string
	strokeColor?: string
	onClick?: () => void
}

const BaseButton: React.FC<BaseButtonProps> = ({ buttonType, iconType, text, width, height, linkPath, isDisabled, fillColor, strokeColor, onClick }) => {
	return (
		<>
			{buttonType === "close" && (
				<button onClick={onClick} className="pt-1 hover:scale-105">
					<IconItems type={iconType} width={width} height={height} />
				</button>
			)}
			{buttonType === "download" && (
				<a href={`${linkPath}`} className="p-2 min-w-56 text-accent text-sm text-center uppercase border-2 border-accent w-full max-w-72">
					{text}
				</a>
			)}
			{buttonType === "accent" && (
				<Link href={`${linkPath}`} className="p-2 min-w-56 text-accent text-sm text-center uppercase border-2 border-accent w-full max-w-72">
					{text}
				</Link>
			)}
			{buttonType === "submit" && (
				<button disabled={isDisabled} type="submit" className="p-2 min-w-56 text-accent text-sm text-center uppercase border-2 border-accent w-full max-w-72">
					<p>{text}</p>
				</button>
			)}
			{buttonType === "logout" && (
				<div>
					<button type="button" onClick={onClick} className="p-2 text-accent uppercase w-full max-w-72">
						<p>{text}</p>
					</button>
				</div>
			)}
			{buttonType === "cart" && (
				<button
					onClick={onClick}
					type="submit"
					disabled={isDisabled}
					onMouseUp={e => e.currentTarget.blur()}
					className={`p-2 capitalize w-full max-w-52 text-white border border-grey rounded-xl transition-transform ease-in-out 
						${isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-primary-light hover:text-white active:text-white hover:bg-primary active:bg-primary hover:scale-105"}`}
				>
					<p className="flex items-center justify-center gap-x-2">
						<IconItems type={iconType} width={width} height={height} fillColor={fillColor} strokeColor={strokeColor} />
						{text}
					</p>
				</button>
			)}
			{buttonType === "link" && (
				<Link
					href={`${linkPath}`}
					onMouseUp={e => e.currentTarget.blur()}
					className="p-2 capitalize w-full max-w-52 text-white bg-primary-light border border-grey rounded-xl hover:text-white active:text-white hover:bg-primary active:bg-primary transition-transform ease-in-out hover:scale-105"
				>
					<p className="flex items-center justify-center gap-x-2">{text}</p>
				</Link>
			)}
		</>
	)
}

export default BaseButton
