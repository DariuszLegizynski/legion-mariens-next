"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { getStrapiCartData } from "@/app/_utils/services/getStrapiData"

import CartItem from "@/app/_components/cart/CartItem"

import type { Cart as CartType } from "@/types/Cart"

const Cart = () => {
	const [cartData, setCartData] = useState<CartType[]>([])
	const [loading, setLoading] = useState(true)

	const fetchCartData = async () => {
		const authToken: string = Cookies.get("jwt")
		const { data } = await getStrapiCartData(`user-carts?filters[session_id][$eq]=${authToken}&populate=*`, authToken)
		setCartData(data)
		setLoading(false)
	}

	useEffect(() => {
		fetchCartData()
	}, [])

	const sum = () => {
		return cartData.map(cartItem => cartItem.attributes.price).reduce((acc, curr) => acc + curr, 0)
	}

	if (loading) return <p>Loading...</p>

	return (
		<article className="max-container my-24 mx-4">
			<h1 className="mb-12">Warenkorb</h1>
			<section className="grid gap-8">
				{cartData.length > 0 &&
					cartData.map(cartItem => <CartItem cartItem={cartItem.attributes} cartId={cartItem.id} key={`cart_${cartItem.id}`} onCartChange={fetchCartData} />)}
			</section>
			<h3 className="mt-12 text-end">
				Insgesamt: <b>{sum().toFixed(2).replace(".", ",")}&nbsp;€</b>
			</h3>
		</article>
	)
}

export default Cart