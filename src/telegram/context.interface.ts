import { Prisma } from '@prisma/client'
import { Context as ContextTelegraf } from 'telegraf'

export interface Context extends ContextTelegraf {
	session: {
		addMode: boolean
		newProduct: Prisma.ProductUpdateInput
	}
}
