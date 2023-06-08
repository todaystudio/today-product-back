export interface IParserProduct {
	title: string
	image: string
	weight: string
	price: string
}

export enum sitesForParsing {
	VKUSVILL,
	GLOBUS,
	PEREKRESTOK,
	METRO,
}

export interface IDomainAndUrl {
	url: string
	domain: string
}
