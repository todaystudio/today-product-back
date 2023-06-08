export const returnPriceDefaultObject = {
	createdAt: true,
	price: true,
	shop: {
		select: {
			title: true,
			slug: true,
		},
	},
	product: {
		select: {
			title: true,
			slug: true,
		},
	},
}
