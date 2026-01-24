import { IsPasswordsMatchingConstraint } from "@/shared"
import {
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from 'class-validator'

export class RegisterDto {
	@IsString({ message: 'Логин должен быть строкой.' })
	@IsNotEmpty({ message: 'Логин обязателен для заполнения.' })
	login: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
	@MinLength(6, {
		message: 'Пароль должен содержать минимум 6 символов.'
	})
	password: string

	@IsString({ message: 'Пароль подтверждения должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле подтверждения пароля не может быть пустым.' })
	@MinLength(6, {
		message: 'Пароль подтверждения должен содержать не менее 6 символов.'
	})
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Пароли не совпадают.'
	})
	passwordRepeat: string
}
