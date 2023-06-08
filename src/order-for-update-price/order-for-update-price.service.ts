import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import {
	ByProductAndUserDto,
	CreateOrderForUpdatePriceDto,
	OFUPByEmailDto,
} from './dto/order-for-update-price.dto'

@Injectable()
export class OrderForUpdatePriceService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

	async create(dto: CreateOrderForUpdatePriceDto) {
		try {
			const order = await this.prisma.orderForUpdatePrice.create({
				data: {
					price: dto.price,
					link: dto.link || '',
					message: dto.message || '',
					Product: {
						connect: {
							id: dto.productId,
						},
					},
					User: {
						connect: {
							email: dto.userEmail,
						},
					},
					status: 'PENDING',
				},
			})

			return order
		} catch (e) {
			throw new BadRequestException(`Creating finish with an error ${e}`)
		}
	}

	async findAll() {
		const orders = await this.prisma.orderForUpdatePrice.findMany({})

		if (!orders) throw new NotFoundException('Orders not found')

		return orders
	}

	async findOne(id: number) {
		const order = await this.prisma.orderForUpdatePrice.findUnique({
			where: { id },
		})

		if (!order) throw new NotFoundException('Order not found')

		return order
	}

	async update(id: number, dto: Prisma.OrderForUpdatePriceUpdateInput) {
		try {
			const order = await this.prisma.orderForUpdatePrice.update({
				where: { id: id },
				data: {
					...dto,
				},
			})
			return order
		} catch (e) {
			throw new BadRequestException('Updating finish with an error')
		}
	}

	async remove(id: number) {
		try {
			const order = await this.prisma.orderForUpdatePrice.delete({
				where: { id },
			})

			return order
		} catch (e) {
			throw new BadRequestException('Deleting finish with an error')
		}
	}

	async getByProductAndUser(dto: ByProductAndUserDto) {
		const user = await this.userService.getByEmail(dto.userEmail)
		if (!user) throw new BadRequestException('User not found')
		const orders = await this.prisma.orderForUpdatePrice.findMany({
			where: {
				userId: user.id,
				productId: dto.productId,
			},
		})
		if (!orders) throw new BadRequestException('Orders not found')
		return orders
	}

	async getByUserEmail(dto: OFUPByEmailDto) {
		const orders = await this.prisma.orderForUpdatePrice.findMany({
			where: {
				User: {
					email: dto.email,
				},
			},
			include: {
				Product: true,
			},
			orderBy: {
				createdAt: 'asc',
			},
		})

		if (!orders) throw new BadRequestException('Orders not found')
		return orders
	}

	async getByUser(id: number) {
		const orders = await this.prisma.orderForUpdatePrice.findMany({
			where: {
				User: {
					id,
				},
			},
			include: {
				Product: true,
			},
			orderBy: {
				createdAt: 'asc',
			},
		})

		if (!orders) throw new BadRequestException('Orders not found')
		return orders
	}
}
