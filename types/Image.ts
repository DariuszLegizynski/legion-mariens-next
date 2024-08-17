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

export interface Image {
	data: {
		id: number
		attributes: {
			url: string
			alternativeText?: string
			caption: null | string
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
			width: number
		}
	}
}
