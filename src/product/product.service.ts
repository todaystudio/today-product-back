import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { calculateStatistics } from 'src/utils/caluculatePriceParams'
import { genSlug } from 'src/utils/generateSlug'
import { getRandomNumber } from 'src/utils/randomNumber'
import { addParseUrlDto } from './dto/add-parse-url.dto'
import { barcodeProductDto } from './dto/barcode-product.dto'
import { CreateProductDto } from './dto/create-product.dto'
import { EnumProductSort, GetAllProductDto } from './dto/get-all-product.dto'
import { IPriceHistory } from './product.interface'
import { returnProductObject } from './return-product.object'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService // private categoryService: CategoryService
	) {}

	async findAll(dto: GetAllProductDto = {}) {
		const { prismaSearchTermFilter, prismaSort } =
			this.getSearchAndSortConfig(dto)

		const { perPage, skip } = this.paginationService.getPagination(dto)
		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage,
			select: {
				...returnProductObject,
			},
		})

		if (!products) throw new NotFoundException(`Products not found`)

		return products
	}

	async create(dto: CreateProductDto, user: User) {
		let slug = genSlug(dto.title)

		const category = await this.prisma.productCategory.findUnique({
			where: {
				id: dto.categoryId,
			},
		})
		if (!category) throw new BadRequestException('Category not found!')

		const slugExist = await this.prisma.product.findUnique({
			where: { slug },
		})

		if (slugExist) slug = slug + '-' + getRandomNumber(1, 1000)

		try {
			const product = await this.prisma.product.create({
				data: {
					title: dto.title,
					slug: slug,
					description: dto.description || '',
					category: {
						connect: {
							id: category.id,
						},
					},
					author: {
						connect: {
							id: user.id,
						},
					},
					imagePath: dto.imagePath,
					weight: dto.weight,
					Barcode: {
						create: {
							code: dto.Barcode,
						},
					},
					parseUrl: dto.parseUrl,
				},
			})

			return product
		} catch (error) {
			if (error.code === 'P2002') {
				throw new BadRequestException('Slug already exists')
			}
			throw error
		}
	}

	async addParseUrl(dto: addParseUrlDto) {
		const { id, url } = dto
		const isExist = await this.getParseUrlById(id)
		if (isExist.includes(url))
			throw new BadRequestException('This link added already')
		const product = await this.prisma.product.update({
			where: { id },
			data: {
				parseUrl: {
					push: url,
				},
			},
		})

		return product
	}

	async deleteParseUrl(dto: addParseUrlDto) {
		const { parseUrl: urlArray } = await this.prisma.product.findUnique({
			where: {
				id: dto.id,
			},
			select: { parseUrl: true },
		})
		if (!urlArray.includes(dto.url))
			throw new BadRequestException("Product hasn't this url")
		const newUrlArray = urlArray.filter((url) => url !== dto.url)
		const product = await this.prisma.product.update({
			where: { id: dto.id },
			data: {
				parseUrl: {
					set: newUrlArray,
				},
			},
		})

		return product
	}

	async findOneById(id: number) {
		const product = await this.prisma.product.findUnique({
			where: {
				id,
			},
			select: returnProductObject,
		})

		if (!product) throw new NotFoundException(`Product with id:${id} not found`)

		return product
	}

	async findOneBySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				slug,
			},
			select: returnProductObject,
		})

		if (!product)
			throw new NotFoundException(`Product with slug:${slug} not found`)

		return product
	}

	async findByCategorySlug(slug: string, pagination: PaginationDto) {
		const { perPage, skip } = this.paginationService.getPagination(pagination)

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: slug,
				},
			},
			select: {
				...returnProductObject,
			},
			orderBy: {
				percentToLastPrice: 'desc',
			},
			skip: skip,
			take: perPage,
		})

		if (!products)
			throw new NotFoundException(`Products by category ${slug} not found!`)

		return products
	}

	async addBarcode(dto: barcodeProductDto) {
		const { code, productId: id } = dto
		const barcode = await this.prisma.barcode
			.create({
				data: {
					code,
					product: {
						connect: {
							id,
						},
					},
				},
			})
			.catch((e) => {
				throw new BadRequestException('Creating barcode finished with error')
			})

		return barcode
	}

	async getBarcodesByProduct(id: number) {
		const barcodes = await this.prisma.barcode.findMany({
			where: {
				product: {
					id,
				},
			},
			select: {
				code: true,
				id: true,
				productId: true,
			},
		})

		if (!barcodes)
			throw new NotFoundException(
				`Barcodes not found for product with id: ${id}`
			)

		return barcodes
	}

	async deleteBarcode({ code }: barcodeProductDto) {
		const barcode = await this.prisma.barcode
			.delete({
				where: { code },
			})
			.catch((e) => {
				throw new BadRequestException('Deleting barcode finished with error')
			})
		return barcode
	}

	async getProductByBarcode(code: string) {
		const products = await this.prisma.product.findMany({
			where: {
				Barcode: {
					some: {
						code,
					},
				},
			},
			select: {
				...returnProductObject,
			},
		})

		if (!products)
			throw new NotFoundException(`Products with ${code} not found!`)

		return {
			code: code,
			products,
		}
	}

	async deleteProductsByCategoryId(categoryId: number) {
		const deletedProducts = await this.prisma.product
			.deleteMany({
				where: {
					productCategoryId: categoryId,
				},
			})
			.catch((e) => {
				throw new BadRequestException(
					"Something went wrong. Delete Products operation hasn't was successful"
				)
			})

		return deletedProducts
	}

	async getSimilarProducts(productId: number) {
		const currentProduct = await this.findOneById(productId)
		if (!currentProduct) throw new NotFoundException('Product not found')
		const similar = await this.prisma.product.findMany({
			where: {
				category: {
					slug: currentProduct.category.slug,
				},
				NOT: {
					id: currentProduct.id,
				},
			},
			select: {
				...returnProductObject,
			},
			take: 6,
		})

		if (!similar) throw new NotFoundException('Similar products not found')

		return similar
	}
	async update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
		try {
			const product = await this.prisma.product.update({
				where: { id },
				data: { ...updateProductDto },
			})

			return product
		} catch (error) {
			if (error.code === 'P2002') {
				throw new BadRequestException('Slug already exists')
			}
			throw error
		}
	}

	async remove(id: number) {
		const deletedProduct = await this.prisma.product.delete({
			where: { id },
		})
		return deletedProduct
	}

	async getHasParseUrl() {
		const product = await this.prisma.product.findMany({
			where: {
				parseUrl: {
					isEmpty: false,
				},
			},
			select: {
				id: true,
				parseUrl: true,
			},
		})

		if (!product) console.log('Product not found')

		return product
	}

	async getParseUrlById(id: number) {
		const { parseUrl: urls } = await this.prisma.product.findUnique({
			where: { id },
			select: { parseUrl: true },
		})

		if (!urls) throw new NotFoundException('Url from this product not found')

		return urls
	}

	private getSearchAndSortConfig(dto: GetAllProductDto) {
		const { searchTerm, sort } = dto
		const prismaSort: Prisma.ProductOrderByWithAggregationInput[] = []

		if (sort === EnumProductSort.LOW_PRICE)
			prismaSort.push({ lastPrice: 'asc' })
		else if (sort === EnumProductSort.HIGH_PRICE)
			prismaSort.push({ lastPrice: 'desc' })
		else if (sort === EnumProductSort.OLDEST)
			prismaSort.push({ createdAt: 'asc' })
		else prismaSort.push({ createdAt: 'desc' })

		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
			? {
					OR: [
						{
							category: {
								title: {
									search: searchTerm,
									mode: 'insensitive',
								},
							},
						},
						{
							title: {
								search: searchTerm,
								mode: 'insensitive',
							},
						},
						{
							description: {
								contains: searchTerm,
								mode: 'insensitive',
							},
						},
						{
							Barcode: {
								some: {
									code: {
										search: searchTerm,
										mode: 'insensitive',
									},
								},
							},
						},
					],
			  }
			: {}

		return { prismaSort, prismaSearchTermFilter }
	}

	async getPriceHistory(id: number): Promise<IPriceHistory[]> {
		const history = await this.prisma.price.findMany({
			where: { productId: id },
			select: {
				createdAt: true,
				price: true,
				shop: {
					select: {
						title: true,
						slug: true,
						logoPath: true,
					},
				},
			},
		})

		if (!history)
			throw new NotFoundException(`History by product ${id} not found!`)

		return history
	}

	async getMostDynamic(dto: PaginationDto) {
		const { perPage, skip } = this.paginationService.getPagination(dto)
		const products = await this.prisma.product.findMany({
			where: {
				NOT: {
					toLastPrice: null,
					percentToLastPrice: null,
					lastPrice: null,
				},
			},
			select: {
				...returnProductObject,
			},
			orderBy: {
				percentToLastPrice: 'asc',
			},
			take: perPage,
			skip,
		})

		if (!products) throw new NotFoundException('Products not found!')

		return products
	}

	async getByShop(slug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				price: {
					some: {
						shop: {
							slug: slug,
						},
					},
				},
			},
		})
		if (!products) throw new NotFoundException('Products not found!')

		return products
	}

	async getPriceParams(productId: number, forChart?: boolean) {
		try {
			const prices = await this.getPriceHistory(productId)
			const statistics = calculateStatistics(prices)

			const dataForChart = []

			if (forChart) {
				return { ...statistics, dataForChart }
			}

			return statistics
		} catch (e) {
			console.log(e)
			throw new BadRequestException(
				'Calculate price statistics finished with fail'
			)
		}
	}
}
