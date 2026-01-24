import {Controller, Get, HttpCode, HttpStatus} from '@nestjs/common'

import {Authorization} from '@/modules/auth/decorators/auth.decorator'
import {Authorized} from '@/modules/auth/decorators/authorized.decorator'
import {UserService} from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('me')
	public async findProfile(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}
}
