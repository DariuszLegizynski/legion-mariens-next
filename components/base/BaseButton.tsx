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
				<form action={onClick}>
					<button className="p-2 text-accent uppercase w-full max-w-72">
						<p>{text}</p>
					</button>
				</form>
			)}
			{buttonType === "cart" && (
				<button
					onClick={onClick}
					onMouseUp={e => e.currentTarget.blur()}
					className="p-2 capitalize w-full max-w-52 text-white bg-primary-light border border-grey rounded-xl hover:text-white active:text-white hover:bg-primary active:bg-primary transition-transform ease-in-out hover:scale-105"
				>
					<p className="flex items-center justify-center gap-x-2">
						<IconItems type={iconType} width={width} height={height} fillColor={fillColor} strokeColor={strokeColor} />
						{text}
					</p>
				</button>
			)}
		</>
	)
}

export default BaseButton
