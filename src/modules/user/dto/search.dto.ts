import {IsNotEmpty, IsString} from 'class-validator'
import {CursorPaginationDto} from "@/shared";

export class SearchDto extends CursorPaginationDto {
	@IsString()
	@IsNotEmpty()
	search: string
}
