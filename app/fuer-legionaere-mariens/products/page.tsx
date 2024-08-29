"use client"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { getStrapiAuthData, createStrapiAuthData, updateStrapiAuthData } from "@/app/_utils/services/getStrapiData"

// types
import type { Product } from "@/types/Product"

// components
import ProductItem from "@/app/fuer-legionaere-mariens/products/_components/ProductItem"
import ProductCategories from "@/app/fuer-legionaere-mariens/products/_components/ProductCategories"

const Materialstelle = () => {
	const [productsData, setProductsData] = useState<Product[]>([])
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
	const [productCategories, setProductCategories] = useState<any[]>([])
	const [productCategory, setProductCategory] = useState<string>("")
	const [cartData, setCartData] = useState<any[]>([])
	const [loading, setLoading] = useState(false)

	const jwt = Cookies.get("jwt")

	useEffect(() => {
		const fetchProducts = async () => {
			const response = await getStrapiAuthData(`products?populate=*&pagination[pageSize]=150&sort=article_code:ASC`, jwt)
			setProductsData(response)
		}
		fetchProducts()

		const fetchProductCategories = async () => {
			const response = await getStrapiAuthData(`product-categories?populate=*`, jwt)
			setProductCategories(response.data)
		}
		fetchProductCategories()

		const fetchCartData = async () => {
			const authToken = Cookies.get("jwt")
			const { data } = await getStrapiAuthData(`user-carts?filters[session_id][$eq]=${authToken}&populate=*`, authToken)
			setCartData(data)
		}
		fetchCartData()
	}, [])

	useEffect(() => {
		let filtered = productsData.data
		if (productCategory && productCategory !== "Alles") {
			filtered = filtered.filter(productItem => productItem.attributes?.product_category?.data?.attributes?.name === productCategory)
		}
		setFilteredProducts(filtered)
	}, [productCategory, productsData])

	const handleToCart = async (productItem: Product, amount: number, warehouseQuantity: number) => {
		if (amount <= 0) return

		setLoading(true)

		try {
			// Check if product is already in cart
			const existingCartItem = cartData?.find((item: any) => item?.attributes?.product?.data[0]?.id === productItem.id)

			if (existingCartItem) {
				const updatedData = {
					data: {
						amount: amount,
						price: (amount * productItem?.attributes?.price).toFixed(2),
					},
				}
				await updateStrapiAuthData(`user-carts/${existingCartItem.id}`, updatedData, jwt)
			} else {
				// Add new product to cart
				const data = {
					data: {
						product: productItem.id,
						amount: amount,
						price: (amount * productItem.attributes.price).toFixed(2),
						quantity: warehouseQuantity,
						session_id: jwt,
					},
				}
				await createStrapiAuthData("user-carts", data, jwt)
			}

			// Fetch updated cart data
			const { data } = await getStrapiAuthData(`user-carts?filters[session_id][$eq]=${jwt}&populate=*`, jwt)
			setCartData(data)
		} catch (error: any) {
			console.error("Error updating cart: ", error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className="max-container my-24 mx-4">
			<h1 className="text-center">Materiallstelle</h1>
			<ProductCategories productCategories={productCategories} setProductCategory={setProductCategory} />
			<section className="grid grid-cols-1 items-center justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
				{filteredProducts?.length > 0 ? (
					filteredProducts?.map((productItem: Product) => (
						<ProductItem key={`product_${productItem.id}`} productItem={productItem} handleToCart={handleToCart} loading={loading} />
					))
				) : (
					<p className="my-16 col-span-full text-center text-accent">Keine Produkte für diese Kategorie gefunden.</p>
				)}
			</section>
		</section>
	)
}

export default Materialstelle
