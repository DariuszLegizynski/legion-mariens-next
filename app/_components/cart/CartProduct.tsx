"use client"

import BaseButton from "@/components/base/BaseButton"
import type { CartItem as CartItemProduct } from "@/types/Cart"
import { deleteStrapiCartData } from "@/app/_utils/services/getStrapiData"
import Cookies from "js-cookie"

const CartProduct = ({ cartProduct, cartId, onCartChange }: { cartProduct: CartItemProduct; cartId: number; onCartChange: () => void }) => {
	const jwt = Cookies.get("jwt")

	const handleDelete = async () => {
		await deleteStrapiCartData("user-carts", jwt!, cartId)
		onCartChange() // Re-fetch the cart data
	}

	return (
		<section>
			<div className="grid grid-cols-[1fr_auto] items-start">
				<h2 className="mb-4">{cartProduct.title}</h2>
				<BaseButton onClick={handleDelete} buttonType="close" iconType="delete" width="1.2rem" height="1.2rem" />
			</div>
			<p>Artikel Nummer: {cartProduct.article_code}</p>
		</section>
	)
}

export default CartProduct
