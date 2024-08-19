import { FC } from "react"
import ProductCategory from "@/app/_components/product/ProductCategory"

type SetProductCategoryCallback = (category: string) => void

interface ProductCategoriesProps {
	productCategories: Array<{ id: string; attributes: { name: string } }>
	setProductCategory: SetProductCategoryCallback
}

const ProductCategories: FC<ProductCategoriesProps> = ({ productCategories, setProductCategory }) => {
	return (
		<section className="grid grid-cols-[1fr_1fr] justify-items-center gap-y-4 mx-auto w-full my-8 xs:grid-cols-3 md:grid-cols-6">
			{productCategories &&
				productCategories.map(prodCat => (
					<ProductCategory key={prodCat.id} name={prodCat.attributes.name} iconType={prodCat.attributes.iconType} setProductCategory={setProductCategory} />
				))}
		</section>
	)
}

export default ProductCategories
