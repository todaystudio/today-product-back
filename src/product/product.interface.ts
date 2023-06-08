import { Prisma } from '@prisma/client'

export interface IProductMostDynamic {
	id: number
	createdAt: Date
	updatedAt: Date
	title: string
	slug: string
	description: string
	weight: number
	imagePath: string
	lastPriceDate: Date
	percentToLastPrice: number
	toLastPrice: number
	userId: number
	productCategoryId: number
	lastPrice: number
}

export interface IPriceHistory {
	createdAt: Date | string
	price: number
	shop: Pick<Prisma.ShopUpdateInput, 'title' | 'slug' | 'logoPath'> | null
}
