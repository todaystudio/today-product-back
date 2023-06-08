import { Page } from 'puppeteer'
import {
	globusParser,
	metroParser,
	perekrestokParser,
	vkusvillParser,
} from './parser.functions'
import { IDomainAndUrl } from './parser.interface'

export function getDomainFromUrl(url: string): IDomainAndUrl {
	try {
		const hostname = new URL(url).hostname
		const domain = hostname.split('.').slice(-2, -1)[0]

		return {
			domain,
			url,
		}
	} catch (e) {
		return null
	}
}

export async function goParsing(url: string, domain: string, page: Page) {
	if (domain === 'vkusvill') return await vkusvillParser(url, page)
	if (domain === 'globus') return await globusParser(url, page)
	if (domain === 'perekrestok') return await perekrestokParser(url, page)
	if (domain === 'metro-cc') return await metroParser(url, page)
}
