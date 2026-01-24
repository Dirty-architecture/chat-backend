import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class LoginDto {
	@IsString({ message: 'Логин должен быть строкой.' })
	@IsNotEmpty({ message: 'Логин обязателен для заполнения.' })
	login: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле пароль не может быть пустым.' })
	@MinLength(6, { message: 'Пароль должен содержать не менее 6 символов.' })
	password: string

	@IsOptional()
	@IsString()
	code: string
}
