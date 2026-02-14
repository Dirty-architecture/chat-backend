import {Injectable, NotFoundException} from '@nestjs/common'
import {PrismaService} from '@/modules/prisma/prisma.service'
import {SearchDto} from "@/modules/user/dto/search.dto";
import {SortOrder} from "@/shared";

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

  public async search(dto: SearchDto, currentUserId: string) {
    const {limit = 20, search, cursor, type = SortOrder.ASC} = dto

    return this.prismaService.user.findMany({
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
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: {
        login: type,
      },
    })
  }
}
