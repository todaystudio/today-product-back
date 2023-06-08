import { Prisma, PrismaClient } from '@prisma/client'

export class CreateShopDto {}

export class GetManyByIdDto {
	ids: number[]
}
