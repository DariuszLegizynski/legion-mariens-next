import { Category } from "./Category"

export interface Event {
	id: number
	attributes: {
		title: string
		startTime: string
		createdAt: string
		updatedAt: string
		publishedAt: string
		category: Category
	}
}
