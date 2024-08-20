export interface CartProduct {
	id: number
	attributes: {
		title: string
		price: number
		createdAt: string
		updatedAt: string
		publishedAt: string
		slug: string
		quantity: number
		article_code: string
	}
}

export interface CartItem {
	quantity: number
	amount: number
	createdAt: string
	updatedAt: string
	publishedAt: string
	session_id: string
	price: number
	product: {
		data: CartProduct[]
	}
}

export interface CartAttributes {
	id: number
	attributes: CartItem
}

export interface Cart {
	data: CartAttributes[]
}
