import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { GetByEmailDto, UpdatePasswordDto, UpdateUserDto } from './dto/user.dto'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('Users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('telegram/admins-tg-id')
	async getAdminsTelegram() {
		return await this.userService.getTelegramIdOfAdmin()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('by-email')
	@Auth()
	async getByEmail(@Body() dto: GetByEmailDto) {
		console.log(dto, 9)
		return await this.userService.getByEmail(dto.email)
	}

	@Get('profile-info')
	@Auth()
	async getProfileInfo(@CurrentUser('id') id: number) {
		return await this.userService.getById(id)
	}

	@Get('by-id/:id')
	@Auth()
	async getById(@Param('id') id: string) {
		return await this.userService.getById(+id)
	}

	@Get('reset-password/:id')
	@Auth()
	async resetPassword(@Param('id') id: string) {
		return await this.userService.resetPassword(+id)
	}

	@UsePipes(new ValidationPipe())
	@Patch('change-password')
	@HttpCode(200)
	@Auth()
	async changePassword(
		@Body() dto: UpdatePasswordDto,
		@CurrentUser('id') id: number
	) {
		return await this.userService.changePassword(dto.password, id)
	}

	@UsePipes(new ValidationPipe())
	@Patch('update')
	@HttpCode(200)
	@Auth()
	async update(@Body() dto: UpdateUserDto, @CurrentUser('id') id: number) {
		return await this.userService.update(dto, id)
	}
}
