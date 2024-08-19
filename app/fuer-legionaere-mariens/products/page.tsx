"use client"
import { useState, useEffect } from "react"

import { getStrapiData } from "@/app/_utils/getStrapiData"

// types
import type { Product } from "@/types/Product"

// components
import ProductComponent from "@/app/_components/product/ProductComponent"
import ProductCategories from "@/app/_components/product/ProductCategories"

const Materialstelle = () => {
	const [productsData, setProductsData] = useState<Product[]>([])
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
	const [productCategories, setProductCategories] = useState<any[]>([])
	const [productCategory, setProductCategory] = useState<string>("")

	useEffect(() => {
		const fetchProducts = async () => {
			const response = await getStrapiData(`products?populate=*&pagination[pageSize]=150&sort=article_code:ASC`)

			setProductsData(response)
		}
		fetchProducts()

		const fetchProductCategories = async () => {
			const response = await getStrapiData(`product-categories?populate=*`)

			setProductCategories(response.data)
		}
		fetchProductCategories()
	}, [])

	useEffect(() => {
		let filtered = productsData.data

		if (productCategory && productCategory != "Alles") {
			filtered = filtered.filter(productItem => productItem.attributes?.product_category?.data?.attributes.name === productCategory)
		}

		setFilteredProducts(filtered)
	}, [productCategory, productsData])

	return (
		<section className="max-container mb-24">
			<h1 className="text-center">Materiallstelle</h1>
			<ProductCategories productCategories={productCategories} setProductCategory={setProductCategory} />
			<section className="grid grid-cols-1 items-center justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
				{filteredProducts?.length > 0 ? (
					filteredProducts?.map((productItem: Product) => <ProductComponent key={`product_${productItem.id}`} productItem={productItem} />)
				) : (
					<p className="my-16 col-span-2 text-center text-accent">Keine Produkte für diese Kategorie gefunden.</p>
				)}
			</section>
		</section>
	)
}

export default Materialstelle
