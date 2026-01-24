import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common'
import type { FastifyRequest, FastifyReply } from 'fastify'
import * as argon2 from 'argon2'

import {LoginDto} from './dto/login.dto'
import {RegisterDto} from './dto/register.dto'
import {PrismaService} from "@/modules/prisma/prisma.service";
import { User } from "@prisma/client"

@Injectable()
export class AuthService {
	public constructor(
    private readonly prisma: PrismaService,
	) {}

  public async register(dto: RegisterDto) {
    const { login, password } = dto

    const existingUser = await this.prisma.user.findUnique({
      where: { login },
    })

    if (existingUser) {
      throw new BadRequestException('Пользователь с таким логином уже существует.')
    }

    const hashedPassword = await argon2.hash(password)
    const user = await this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
      },
      select: {
        id: true,
        login: true,
        createdAt: true,
      },
    })

    return {
      user,
      message: 'Регистрация прошла успешно.',
    }
  }

	public async login(req: FastifyRequest, dto: LoginDto) {
    const { login, password } = dto

    const user = await this.prisma.user.findUnique({
      where: { login },
    })

    if (!user) {
      throw new BadRequestException('Пользователь не найден')
    }

    const validPassword = await argon2.verify(user.password, password)
    if (!validPassword) {
      throw new BadRequestException('Неверный пароль')
    }

    return this.saveSession(req, user)
  }

	public async logout(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.'
            )
          )
        }
        resolve()
      })
    })
	}

  private async saveSession(req: FastifyRequest, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id

      req.session.save(err => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.'
            )
          )
        }

        resolve({
          user
        })
      })
    })
  }
}
