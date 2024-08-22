"use client"

import CartProduct from "@/app/fuer-legionaere-mariens/cart/_components/CartProduct"
import type { CartItem as CartItemProduct } from "@/types/Cart"

const CartItem = ({ cartItem, cartId, onCartChange }: { cartItem: CartItemProduct; cartId: number; onCartChange: () => void }) => {
	return (
		<article className="border-b border-grey pb-8 grid gap-2">
			<section>
				{cartItem.product.data?.length > 0 &&
					cartItem.product.data?.map((cartProduct: CartItemProduct) => (
						<CartProduct cartProduct={cartProduct.attributes} cartId={cartId} key={`cartProduct_${cartProduct.id}`} onCartChange={onCartChange} />
					))}
			</section>
			<section className="flex justify-between">
				<p>Anzahl: {cartItem.amount}</p>
				<p>
					Preis:&nbsp;<b>{cartItem.price.toFixed(2).replace(".", ",")}&nbsp;€</b>
				</p>
			</section>
		</article>
	)
}

export default CartItem
