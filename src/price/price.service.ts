import { Injectable, NotFoundException } from '@nestjs/common'
import { Price } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'
import { CreatePriceDto } from './dto/create-price.dto'
import { UpdatePriceDto } from './dto/update-price.dto'
import { returnPriceDefaultObject } from './return-price.object'

@Injectable()
export class PriceService {
	constructor(
		private prisma: PrismaService,
		private productService: ProductService
	) {}

	async create(dto: CreatePriceDto) {
		const price = await this.prisma.price.create({
			data: {
				price: dto.price,
				product: {
					connect: {
						id: dto.productId,
					},
				},
				shop: {
					connect: {
						id: dto.shopId || 2,
					},
				},
			},
		})

		return await this.updateProductRelativePrice(
			dto.productId,
			price,
			dto.price
		)
	}

	async findAll() {
		const prices = await this.prisma.price.findMany({
			orderBy: {
				createdAt: 'asc',
			},
			select: { ...returnPriceDefaultObject },
		})

		if (!prices) throw new NotFoundException('Prices not found!')

		return prices
	}

	async findOneById(id: number) {
		const prices = await this.prisma.price.findUnique({
			where: { id },
			select: { ...returnPriceDefaultObject },
		})

		if (!prices) throw new NotFoundException('Prices not found!')

		return prices
	}

	async findByProductId(id: number) {
		const prices = await this.prisma.price.findMany({
			where: {
				product: {
					id,
				},
			},
			orderBy: {
				createdAt: 'asc',
			},
			select: {
				price: true,
				createdAt: true,
			},
		})

		if (!prices) throw new NotFoundException('Prices not found!')

		return prices
	}

	async update(id: number, dto: UpdatePriceDto) {
		return await this.prisma.price.update({
			where: { id },
			data: {
				...dto,
			},
			select: { ...returnPriceDefaultObject, updatedAt: true },
		})
	}

	async remove(id: number) {
		return await this.prisma.price.delete({
			where: { id },
			select: { ...returnPriceDefaultObject },
		})
	}

	private async updateProductRelativePrice(
		productId: number,
		price: Price,
		newPrice: number
	) {
		if (!newPrice) return
		const currentProduct = await this.productService.findOneById(productId)
		const firstPrice = currentProduct?.price[0].price
		if (firstPrice) {
			const toLastPrice = newPrice - firstPrice
			const percentToLastPrice =
				toLastPrice === 0
					? currentProduct.percentToLastPrice
					: Math.floor(Number(toLastPrice / firstPrice) * 100)
			const updatedProduct = await this.productService.update(productId, {
				toLastPrice,
				lastPrice: newPrice,
				lastPriceDate: price.createdAt,
				percentToLastPrice,
			})

			return updatedProduct
		} else {
			const updatedProduct = await this.productService.update(productId, {
				toLastPrice: 0,
				lastPrice: newPrice,
				lastPriceDate: price.createdAt,
				percentToLastPrice: 0,
			})

			return updatedProduct
		}
	}
}
