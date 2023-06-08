import { Prisma } from '@prisma/client'

export const returnProductObject: Prisma.ProductSelect = {
	title: true,
	slug: true,
	description: true,
	id: true,
	category: {
		select: {
			slug: true,
			title: true,
			id: true,
			icon: true,
		},
	},
	author: {
		select: {
			id: true,
			name: true,
			avatarPath: true,
		},
	},
	imagePath: true,
	lastPriceDate: true,
	percentToLastPrice: true,
	price: {
		orderBy: {
			createdAt: 'asc',
		},
	},
	weight: true,
	toLastPrice: true,
	lastPrice: true,
	Barcode: {
		select: {
			code: true,
		},
	},
	parseUrl: true,
}
