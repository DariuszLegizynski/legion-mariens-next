import { FC } from "react"
import IconItems from "@/components/base/IconItems"

const ProductCategory: FC<{ name: string; iconType: string; setProductCategory: (category: string) => void }> = ({ name, iconType, setProductCategory }) => {
	return (
		<section
			onClick={() => setProductCategory(name)}
			className="flex flex-col items-center bg-primary-light p-2 rounded-xl min-w-28 max-w-40 cursor-pointer hover:scale-105 hover:bg-primary focus:scale-105 focus:bg-primary transition-all ease-in-out"
		>
			<IconItems type={iconType} fillColor="white" width="4rem" height="4rem" />
			<p className="text-white mt-2">{name}</p>
		</section>
	)
}

export default ProductCategory
