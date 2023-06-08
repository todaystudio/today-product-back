import { Page } from 'puppeteer'

export async function vkusvillParser(url: string, page: Page) {
	try {
		if (!url) return null
		await page.goto(url)
		await page.waitForSelector('.Price')
		await page.mouse.wheel({
			deltaY: 1400,
		})

		const price = await page.evaluate(() => {
			let price = 0
			const priceHtml = document
				.querySelector('.Price__value')
				.textContent.trim()
			price = +priceHtml
			return price
		})

		return price
	} catch (e) {
		return null
	}
}
export async function globusParser(url: string, page: Page) {
	try {
		if (!url) return null
		await page.goto(url)
		await page.mouse.wheel({
			deltaY: 1400,
		})
		const price = await page.evaluate(async () => {
			let price = 0
			const priceHtml = document
				.querySelector('.catalog-detail__item-price-actual-main')
				.textContent.trim()
			price = +priceHtml
			return price
		})

		return price
	} catch (e) {
		return null
	}
}
export async function perekrestokParser(url: string, page: Page) {
	try {
		if (!url) return null
		await page.goto(url)
		await page.mouse.wheel({
			deltaY: 1400,
		})
		await page.waitForSelector('.price-new')

		const price = await page.evaluate(() => {
			let price = 0
			const priceHtml = document
				.querySelector('meta[itemprop="price"]')
				.getAttribute('content')
				.trim()
			price = +priceHtml
			return price
		})

		return price
	} catch (e) {
		return null
	}
}
export async function metroParser(url: string, page: Page) {
	try {
		if (!url) return null
		await page.goto(url)
		await page.mouse.wheel({
			deltaY: 1400,
		})

		const price = await page.evaluate(() => {
			let price = 0
			const priceHtml = document
				.querySelector('.product-price__sum-rubles')
				.innerHTML.trim()
			price = +priceHtml
			return price
		})

		return price
	} catch (e) {
		console.log('err metro catch', e)
		return null
	}
}
