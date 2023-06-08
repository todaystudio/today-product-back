import { Controller, Get } from '@nestjs/common'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('all')
	async getAll() {
		return await this.statisticsService.getAll()
	}

	@Get('products-count')
	async getProductsCount() {
		return await this.statisticsService.getProductsCount()
	}

	@Get('shops-count')
	async getShopsCount() {
		return await this.statisticsService.getShopsCount()
	}

	@Get('prices-count')
	async getPricesCount() {
		return await this.statisticsService.getPricesCount()
	}

	@Get('users-count')
	async getUsersCount() {
		return await this.statisticsService.getUsersCount()
	}

	@Get('avg-price')
	async getAvgPrice() {
		return await this.statisticsService.getAvgPrice()
	}
}
