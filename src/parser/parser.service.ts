import { BadRequestException, Injectable } from '@nestjs/common'
import axios from 'axios'
import { createWriteStream } from 'fs-extra'
import path from 'path'
import puppeteer, { Page } from 'puppeteer'
import { PriceService } from 'src/price/price.service'
import { ProductService } from 'src/product/product.service'
import { getDomainFromUrl, goParsing } from './parser.utils'
import { productsPerekrestok } from './productParser/links.db'
import { createProductsFromJson } from './productParser/product-parser'

@Injectable()
export class ParserService {
	constructor(
		private productService: ProductService,
		private priceService: PriceService
	) {}

	async parsePriceForAll() {
		const browser = await puppeteer.launch({
			headless: false,
		})
		const page = await browser.newPage()

		try {
			const products = await this.productService.getHasParseUrl()
			for (const product of products) {
				await new Promise((r) => setTimeout(r, 7000))
				const urls: string[] = product.parseUrl
				const prices: number[] = []
				for (const url of urls) {
					const price = await this.parsePriceOne(url, page)
					if (price) prices.push(price)
				}
				const newPrice = this.checkPricesArray(prices)
				if (newPrice) {
					console.log(newPrice, ' NEW PRICE!')
					this.priceService.create({
						price: newPrice,
						productId: product.id,
					})
				}
			}
		} finally {
			await browser.close()
		}
	}

	async goParserById(id: number) {
		const browser = await puppeteer.launch({
			headless: false,
		})
		try {
			const page = await browser.newPage()
			const urls: string[] = await this.productService.getParseUrlById(id)
			const newPrices: number[] = []

			for (let i = 0; i < urls.length; i++) {
				const price = await this.parsePriceOne(urls[i], page)
				if (price) newPrices.push(price)
			}

			await browser.close()

			return this.checkPricesArray(newPrices)
		} catch (e) {
			await browser.close()
			throw new BadRequestException('Price parsing was finished with an error')
		}
	}

	async parsePriceOne(url: string, page: Page) {
		try {
			const domain = getDomainFromUrl(url)
			if (!domain)
				throw new BadRequestException(
					'Price parsing was finished with an error'
				)

			const newPrice = await goParsing(domain.url, domain.domain, page)

			console.log(newPrice, 6)
			if (!newPrice) return null

			return newPrice
		} catch (e) {
			throw new BadRequestException('Price parsing was finished with an error')
		}
	}

	async downloadImage(
		url: string,
		destinationPath: string = 'back/uploads/parser'
	) {
		try {
			const response = await axios.get(url, { responseType: 'stream' })
			const fileName = path.basename(url)
			const imagePath = path.join(destinationPath, fileName)

			response.data.pipe(createWriteStream(imagePath))

			return new Promise((resolve, reject) => {
				response.data.on('end', () => {
					resolve(imagePath)
				})

				response.data.on('error', (err) => {
					reject(err)
				})
			})
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	async parseProductsFromShops() {
		return await createProductsFromJson(productsPerekrestok)
	}

	private removeQueryString(url) {
		const queryStringIndex = url.indexOf('?')
		if (queryStringIndex !== -1) {
			url = url.slice(0, queryStringIndex)
		}
		return url
	}

	private checkPricesArray(prices: number[]): number {
		if (prices.length === 0) return null
		if (prices.length === 1) return Math.floor(prices[0])
		if (prices.length > 1) {
			const sum = prices.reduce((acc, number) => acc + number, 0)
			return Math.floor(sum / prices.length)
		}
	}
}
