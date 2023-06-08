import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { genSlug } from 'src/utils/generateSlug'
import { getRandomNumber } from 'src/utils/randomNumber'
import { GetManyByIdDto } from './dto/create-shop.dto'
import { returnShopDefaultObject } from './return-shop.object'

@Injectable()
export class ShopService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: Prisma.ShopCreateInput) {
		const slugExist = await this.prisma.shop.findUnique({
			where: {
				slug: genSlug(dto.title),
			},
		})
		const shop = await this.prisma.shop.create({
			data: {
				...dto,
				slug: !slugExist
					? genSlug(dto.title)
					: genSlug(dto.title) + getRandomNumber(1, 1000),
			},
			select: {
				...returnShopDefaultObject,
			},
		})

		return shop
	}

	async findAll() {
		const shops = await this.prisma.shop.findMany({
			select: {
				...returnShopDefaultObject,
				_count: {
					select: {
						price: true,
					},
				},
			},
			orderBy: {
				price: {
					_count: 'desc',
				},
			},
		})

		if (!shops) throw new NotFoundException('Shops not found!')
		return shops
	}

	async findOneById(id: number) {
		const shop = await this.prisma.shop.findUnique({
			where: { id },
			select: {
				...returnShopDefaultObject,
			},
		})
		if (!shop) throw new NotFoundException('Shop not found!')
		return shop
	}

	async findOneBySlug(slug: string) {
		const shop = await this.prisma.shop.findUnique({
			where: { slug },
			select: {
				...returnShopDefaultObject,
			},
		})
		if (!shop) throw new NotFoundException('Shop not found!')
		return shop
	}

	async findManyById(dto: GetManyByIdDto) {
		const shops = []
		const ids = [...new Set(dto.ids)]
		await Promise.all(
			ids.map(async (id) => {
				const shop = await this.prisma.shop.findUnique({ where: { id } })
				if (shop) shops.push(shop)
			})
		)
		if (!shops) throw new NotFoundException('Shop not found!')
		return shops
	}

	async update(id: number, dto: Prisma.ShopUpdateInput) {
		const shop = await this.prisma.shop.update({
			where: { id },
			data: {
				...dto,
			},
		})
		if (!shop) throw new NotFoundException("Shop didn't update")
		return shop
	}

	async remove(id: number) {
		const deletedPrices = await this.prisma.price
			.deleteMany({
				where: {
					shop: {
						id: id,
					},
				},
			})
			.catch((e) => {
				throw new BadRequestException(
					"Something went wrong. Delete prices operations hasn't was successful"
				)
			})

		const shop = await this.prisma.shop
			.delete({
				where: { id },
			})
			.catch((e) => {
				throw new BadRequestException(
					"Something went wrong. Delete shop operation hasn't was successful"
				)
			})

		return shop
	}
}
