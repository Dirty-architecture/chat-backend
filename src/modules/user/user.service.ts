import {Injectable, NotFoundException} from '@nestjs/common'
import {PrismaService} from '@/modules/prisma/prisma.service'
import { SearchDto } from '@/modules/user/dto/search.dto'
import { SortOrder } from '@/shared'
import { ICursor } from '@/shared/interfaces/cursor.interface'

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      },
    })

    if (!user) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста, проверьте введенные данные.'
      )
    }

    return user
  }

  public async search(
    dto: SearchDto,
    currentUserId: string
  ): Promise<
    ICursor<{
      id: string
      login: string
      picture: string | null
      lastSeenAt: Date | null
    }>
  > {
    const { limit = 20, search, cursor, type = SortOrder.ASC } = dto

    const rows = await this.prismaService.user.findMany({
      where: {
        login: {
          contains: search,
          mode: 'insensitive',
        },
        NOT: {
          id: currentUserId,
        },
      },
      select: {
        id: true,
        login: true,
        picture: true,
        lastSeenAt: true,
      },
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: {
        id: type,
      },
    })

    const hasNext = rows.length > limit
    const items = hasNext ? rows.slice(0, limit) : rows
    const nextCursor = items.length ? items[items.length - 1].id : null

    return {
      items,
      hasNext,
      cursor: hasNext ? nextCursor : null,
    }
  }
}
