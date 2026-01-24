import {Body, Controller, HttpCode, HttpStatus, Post, Req, Res} from '@nestjs/common'
import type { FastifyRequest, FastifyReply } from 'fastify'
import {AuthService} from './auth.service'
import {LoginDto} from './dto/login.dto'
import {RegisterDto} from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: FastifyRequest,
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(req, dto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.logout(req, res)
  }
}