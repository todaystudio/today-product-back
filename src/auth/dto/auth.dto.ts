import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsEmail()
	email: string

	@MinLength(6, {
		message: "Password can't be less than 6 characters",
	})
	@IsString()
	password: string
}
