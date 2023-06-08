import { IsEmail, IsOptional, IsString } from 'class-validator'

export class GetByEmailDto {
	@IsString()
	@IsEmail()
	email: string
}

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsString()
	@IsOptional()
	avatarPath?: string
}

export class UpdatePasswordDto {
	@IsString()
	password: string
}
