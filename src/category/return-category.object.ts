import { Prisma } from '@prisma/client'

export const returnCategoryDefaultObject: Prisma.ProductCategorySelect = {
	id: true,
	title: true,
	slug: true,
	description: true,
	createdAt: true,
	icon: true,
	_count: {
		select: {
			Product: true,
		},
	},
}
