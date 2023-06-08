import { IPriceHistory } from 'src/product/product.interface'

export interface ICalculateStatistics {
	mode: number[]
	median: number
	mean: number
	forecast: IForecast[]
	dataForChart: IForecast[]
}

export interface IForecast {
	date: string | Date
	price: number
	category: 'forecast' | 'history' | string
}

export function calculateStatistics(
	prices: IPriceHistory[]
): ICalculateStatistics {
	// Получаем только цены из массива объектов
	const priceArray = prices.map((price) => price.price)

	// Вычисляем моду
	const mode = calculateMode(priceArray)

	// Вычисляем медиану
	const median = calculateMedian(priceArray)

	// Вычисляем среднее значение
	const mean = calculateMean(priceArray)

	const forecast = calculateExponentialSmoothingForecast(prices)

	const dataForChart = prepareDataForChart(prices, forecast)

	return { mode, median, mean, forecast, dataForChart }
}

function calculateMode(prices: number[]) {
	const frequencyMap: Record<number, number> = {}
	let maxFrequency = 0
	let mode: number[] = []

	for (const price of prices) {
		frequencyMap[price] = (frequencyMap[price] || 0) + 1
		if (frequencyMap[price] > maxFrequency) {
			maxFrequency = frequencyMap[price]
			mode = [price]
		} else if (frequencyMap[price] === maxFrequency) {
			mode.push(price)
		}
	}

	return mode
}

function calculateMedian(prices: number[]) {
	const sortedPrices = prices.sort((a, b) => a - b)
	const midIndex = Math.floor(sortedPrices.length / 2)

	if (sortedPrices.length % 2 === 0) {
		// Если количество элементов четное, берем среднее двух центральных элементов
		return (sortedPrices[midIndex - 1] + sortedPrices[midIndex]) / 2
	} else {
		// Если количество элементов нечетное, берем центральный элемент
		return sortedPrices[midIndex]
	}
}

function calculateMean(prices: number[]) {
	const sum = prices.reduce((acc, price) => acc + price, 0)
	return sum / prices.length
}

function calculateExponentialSmoothingForecast(
	pricesHistory: IPriceHistory[],
	alpha: number = 0.5
) {
	const prices = pricesHistory.map((i) => i.price)
	let smoothedPrices: number[] = []
	smoothedPrices[0] = prices[0] // Первое сглаженное значение равно первому наблюдаемому значению

	for (let i = 1; i < prices.length; i++) {
		smoothedPrices[i] = alpha * prices[i] + (1 - alpha) * smoothedPrices[i - 1]
	}

	const lastPriceHistory = prices[prices.length - 1]
	const lastPriceSmooth = smoothedPrices[smoothedPrices.length - 1]

	const forecast =
		lastPriceHistory + alpha * (lastPriceHistory - lastPriceSmooth)
	smoothedPrices.push(forecast)

	const forecastArr = smoothedPrices.map((i, idx) => {
		if (idx === pricesHistory.length) {
			const newDate = new Date(pricesHistory[idx - 1].createdAt)
			newDate.setHours(newDate.getHours() + 24)
			return {
				date: newDate,
				price: i,
				category: 'forecast',
			}
		} else {
			return {
				date: pricesHistory[idx].createdAt,
				price: i,
				category: 'forecast',
			}
		}
	})

	return forecastArr
}

function prepareDataForChart(
	pricesHistory: IPriceHistory[],
	forecast: IForecast[]
) {
	const data = []
	pricesHistory.forEach((i) => {
		data.push({ date: i.createdAt, price: i.price, category: 'history' })
	})
	data.push(...forecast)

	return data
}
