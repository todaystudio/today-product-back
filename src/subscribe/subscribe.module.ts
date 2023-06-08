import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { SubscribeController } from './subscribe.controller'
import { SubscribeService } from './subscribe.service'

@Module({
	controllers: [SubscribeController],
	providers: [SubscribeService, PrismaService],
	exports: [SubscribeService],
})
export class SubscribeModule {}
