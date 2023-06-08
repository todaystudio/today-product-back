import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'
import { genSlug } from 'src/utils/generateSlug'
import { getRandomNumber } from 'src/utils/randomNumber'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { returnCategoryDefaultObject } from './return-category.object'

@Injectable()
export class CategoryService {
	constructor(
		private readonly prisma: PrismaService,
		private productService: ProductService
	) {}

	async create(dto: CreateCategoryDto) {
		const { description, icon, title } = dto
		const slugExist = await this.prisma.productCategory.findUnique({
			where: {
				slug: genSlug(dto.title),
			},
		})
		const category = await this.prisma.productCategory
			.create({
				data: {
					title,
					slug: !slugExist
						? genSlug(title)
						: genSlug(title) + getRandomNumber(1, 1000),
					description,
					icon,
				},
			})
			.catch((e) => {
				throw new BadRequestException(
					`Creating product category finished with error: ${e}`
				)
			})

		return category
	}

	async findAll() {
		const category = await this.prisma.productCategory.findMany({
			select: {
				...returnCategoryDefaultObject,
			},
		})

		if (!category) throw new NotFoundException('Categories not found')

		return category
	}

	async findOneById(id: number) {
		const category = await this.prisma.productCategory.findUnique({
			where: { id },
			select: {
				...returnCategoryDefaultObject,
			},
		})
		if (!category) throw new NotFoundException('Category not found!')
		return category
	}

	async findOneBySlug(slug: string) {
		const category = await this.prisma.productCategory.findUnique({
			where: { slug },
			select: {
				...returnCategoryDefaultObject,
			},
		})
		if (!category) throw new NotFoundException('Category not found!')
		return category
	}

	async update(id: number, dto: UpdateCategoryDto) {
		const category = await this.prisma.productCategory
			.update({
				where: { id },
				data: { ...dto },
			})
			.catch((e) => {
				throw new BadRequestException(
					`Updating product category finished with error: ${e}`
				)
			})

		return category
	}

	async remove(id: number) {
		const deletedProducts =
			await this.productService.deleteProductsByCategoryId(id)
		const category = await this.prisma.productCategory
			.delete({
				where: { id },
			})
			.catch((e) => {
				throw new BadRequestException(
					"Something went wrong. Delete category operation hasn't was successful"
				)
			})

		return category
	}
}
