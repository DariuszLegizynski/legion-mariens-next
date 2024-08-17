import { Image } from "./Image"

export interface Child {
	type: string
	text: string
}

export interface Content {
	type: string
	children: Child[]
}

export interface LandingPageData {
	about: {
		id: number
		content?: Content[]
		title?: string | null
	}
	introduction: {
		id: number
		avatar?: Image
		content?: Content[]
		title?: string | null
	}
	termine: {
		id: number
		content?: Content[]
		title?: string | null
	}
}
