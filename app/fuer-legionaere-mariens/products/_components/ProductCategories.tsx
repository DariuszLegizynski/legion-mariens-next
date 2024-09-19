import { FC } from "react"
import ProductCategory from "@/app/fuer-legionaere-mariens/products/_components/ProductCategory"
import IconItems from "@/components/base/IconItems"
import Link from "next/link"

type SetProductCategoryCallback = (category: string) => void

interface ProductCategoriesProps {
	productCategories: Array<{ id: string; attributes: { name: string } }>
	setProductCategory: SetProductCategoryCallback
}

const ProductCategories: FC<ProductCategoriesProps> = ({ productCategories, setProductCategory }) => {
	return (
		<section className="grid grid-cols-[1fr_1fr] justify-items-center gap-y-4 mx-auto w-full my-8 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
			{productCategories &&
				productCategories.map(prodCat => (
					<ProductCategory key={prodCat.id} name={prodCat.attributes?.name} iconType={prodCat.attributes?.iconType} setProductCategory={setProductCategory} />
				))}
			<Link
				href="fuer-legionaere-mariens/cart"
				className="flex flex-col items-center col-span-2 xs:col-span-3 md:col-span-1 bg-green p-2 rounded-xl min-w-28 max-w-40 cursor-pointer hover:scale-105 hover:bg-green-dark focus:scale-105 focus:bg-green-dark transition-all ease-in-out"
			>
				<IconItems type="cart" fillColor="white" width="4rem" height="4rem" />
				<p className="text-white mt-2">Warenkorb</p>
			</Link>
		</section>
	)
}

export default ProductCategories
