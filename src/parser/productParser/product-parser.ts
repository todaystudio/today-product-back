import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import puppeteer, { Page } from 'puppeteer'
import { generateSlug } from 'src/utils/generateSlug'
import { getRandomNumber } from 'src/utils/randomNumber'
import { productPerekrestokList, userAgents } from './links.db'

export interface parseProduct {
	title: string
	price: number
	imagePath: string
	weight: number
	url: string
	category: string
}

export interface parseCategory {
	categoryTitle: string
	list: string[]
}

dotenv.config()
const prisma = new PrismaClient()

export async function productParserPerekrestok() {
	const browser = await puppeteer.launch({
		headless: false,
	})
	const page = await browser.newPage()
	// const categories = linksCatPerekrestok
	let categories: parseCategory[] = productPerekrestokList
	let products: parseProduct[] = []
	let counter = 0

	// for (const category of categories) {
	// 	const list = await parsePerekrestokList(category, page)
	// 	if (list) productsUrl.push({ ...list })
	// }

	while (counter < 20) {
		for (const category of categories) {
			for (const product of category.list) {
				const productData: Omit<parseProduct, 'category'> =
					await parsePerekrestokProduct(product, page)
				if (productData && productData !== null) {
					products.push({
						...productData,
						category: category.categoryTitle,
					})
					console.log({
						qw: productData.title,
						category: category.categoryTitle,
					})
				}
				counter++
			}
		}
	}

	await browser.close()
	return products
}

export async function parsePerekrestokList(url: string, page: Page) {
	try {
		await page.goto(`https://www.perekrestok.ru${url}`)
		await page.waitForSelector('.footer-app-links__item')
		await page.mouse.wheel({
			deltaY: 10000,
		})
		const list = await page.evaluate(() => {
			const categoryTitle = document.querySelector(
				'.catalog-category__title'
			).textContent
			const cards = document.querySelectorAll('.product-card__link')
			const list: string[] = []
			for (const card of cards) {
				const link = card.getAttribute('href')
				if (link) list.push(link)
			}

			return { list, categoryTitle }
		})

		return list
	} catch {
		return null
	}
}

export async function parsePerekrestokProduct(
	url: string,
	page: Page
): Promise<Omit<parseProduct, 'category'>> {
	try {
		await page.setUserAgent(getRandomUserAgent())
		await setTimeout(() => {}, getRandomNumber(3, 30))
		await page.setViewport({
			height: getRandomNumber(500, 650),
			width: getRandomNumber(500, 992),
			isMobile: getRandomNumber(0, 1) === 1,
		})
		await page.goto(`https://www.perekrestok.ru${url}`)
		await page.waitForSelector('.footer-app-links__item')
		const product = await page.evaluate(() => {
			const title: string =
				document.querySelector('.product__title').textContent
			const price: number = Math.floor(
				Number(
					document
						.querySelector('meta[itemprop="price"]')
						.getAttribute('content')
				)
			)
			const imagePath: string = document
				.querySelector('.img-top-slider')
				.getAttribute('src')

			if (!title || !price || !imagePath) return null

			return {
				title,
				price,
				imagePath,
			}
		})
		console.log(product)
		if (!product) return null
		return {
			...product,
			url: `https://www.perekrestok.ru${url}`,
			weight: extractWeight(product.title),
		}
	} catch (e) {
		console.log(e)
		return null
	}
}

export async function parsePerekrestokCategories() {
	const browser = await puppeteer.launch({
		headless: false,
	})
	const page = await browser.newPage()
	await page.goto('https://www.perekrestok.ru/cat')
	await page.waitForSelector('.footer-app-links__item')

	const list = await page.evaluate(() => {
		const cards = document.querySelectorAll('.jOJSmb a')
		const list: string[] = []
		for (const card of cards) {
			const link = card.getAttribute('href')
			if (link) list.push(link)
		}

		return list
	})

	await browser.close()
	return list
}

export function extractWeight(str: string): number {
	const match = str.match(/(\d+)\s*г$/)
	if (match) {
		return parseInt(match[1], 10)
	}
	return 0
}

export async function createProductsFromJson(products: parseProduct[]) {
	try {
		for (const product of products) {
			const title = product.title
			const slug = generateSlug(title) + '-' + getRandomNumber(1, 1000)
			const categorySlug = generateSlug(product.category)

			const newPrice = await prisma.price.create({
				data: {
					price: product.price,
				},
			})

			if (!newPrice) throw new Error('No PRICE')

			const newProduct = await prisma.product.create({
				data: {
					title: title,
					description: title,
					slug: slug,
					author: {
						connect: {
							id: 3,
						},
					},
					category: {
						connectOrCreate: {
							where: {
								slug: categorySlug,
							},
							create: {
								slug: categorySlug,
								title: product.category,
							},
						},
					},
					price: {
						connect: {
							id: newPrice.id,
						},
					},
					lastPrice: product.price,
					imagePath: product.imagePath,
					parseUrl: product.url,
					weight: product.weight,
				},
			})

			if (!newProduct) throw new Error('No PRODUCT')
		}
	} catch (error) {
		console.log(error)
	}
}

function getRandomUserAgent() {
	return userAgents[getRandomNumber(0, userAgents.length - 1)]
}
