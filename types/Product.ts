interface FormatImage {
	ext: string
	hash: string
	height: number
	mime: string
	name: string
	path: string | null
	size: number
	sizeInBytes: number
	url: string
	width: number
}

interface Format {
	large?: FormatImage
	medium?: FormatImage
	small?: FormatImage
	thumbnail?: FormatImage
}

interface Image {
	data: {
		attributes: {
			alternativeText: null
			caption: null
			createdAt: string
			ext: string
			formats: Format
			hash: string
			height: number
			mime: string
			name: string
			previewUrl: null
			provider: string
			provider_metadata: null
			size: number
			updatedAt: string
			url: string
			width: number
		}
	}
}

interface ProductCategory {
	data: {
		attributes: {
			createdAt: string
			name: string
			publishedAt: string
			updatedAt: string
		}
	}
	id: number
}

export interface Product {
	attributes: {
		article_code: string
		createdAt: string
		image: Image
	}
	id: number
	price: number
	product_category: ProductCategory
	publishedAt: string
	quantity: number
	slug: string
	title: string
	updatedAt: string
}
