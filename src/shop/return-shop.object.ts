import { Prisma } from '@prisma/client'

export const returnShopDefaultObject: Prisma.ShopSelect = {
	id: true,
	logoPath: true,
	slug: true,
	title: true,
	website: true,
}
