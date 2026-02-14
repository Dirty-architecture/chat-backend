import {Body, Controller, Get, HttpCode, HttpStatus, Post} from '@nestjs/common'

import {Authorization} from '@/modules/auth/decorators/auth.decorator'
import {Authorized} from '@/modules/auth/decorators/authorized.decorator'
import {UserService} from './user.service'
import {SearchDto} from "@/modules/user/dto/search.dto";

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('me')
	public async findProfile(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post('search')
  public async search(@Body() dto: SearchDto, @Authorized('id') currentUserId: string) {
    return this.userService.search(dto, currentUserId)
  }
}
