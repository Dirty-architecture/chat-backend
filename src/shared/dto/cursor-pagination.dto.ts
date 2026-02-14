import { IsOptional, IsUUID, IsNumber, Min, Max, IsEnum} from 'class-validator'
import { Type } from 'class-transformer'
import {SortOrder} from "../enum";

export class CursorPaginationDto {
  @IsOptional()
  @IsUUID('4', { message: 'Cursor должен быть UUID v4.' })
  cursor?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit должен быть числом.' })
  @Min(1, { message: 'Limit должен быть больше 0.' })
  @Max(50, { message: 'Limit не может быть больше 50.' })
  limit?: number = 20

  @IsOptional()
  @IsEnum(SortOrder, {
    message: 'Type должен быть либо asc, либо desc.',
  })
  type?: SortOrder = SortOrder.ASC
}
