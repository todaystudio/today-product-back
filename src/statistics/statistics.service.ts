import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class StatisticsService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		const statistic = {
			productsCount: await this.getProductsCount(),
			shopsCount: await this.getShopsCount(),
			pricesCount: await this.getPricesCount(),
			usersCount: await this.getUsersCount(),
			avgPrice: (await this.getAvgPrice())._avg.price,
		}

		return statistic
	}

	async getProductsCount() {
		return await this.prisma.product.count({})
	}

	async getShopsCount() {
		return await this.prisma.shop.count({})
	}

	async getPricesCount() {
		return await this.prisma.price.count({})
	}

	async getUsersCount() {
		return await this.prisma.user.count({})
	}

	async getAvgPrice() {
		return await this.prisma.price.aggregate({
			_avg: {
				price: true,
			},
		})
	}
}
