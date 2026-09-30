import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../../core/pagination/pagination-query.dto';

export class FindAllUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description:
      'Filtra por nome, e-mail ou matrícula (busca parcial, sem diferenciar maiúsculas)',
    example: 'maria',
    maxLength: 120,
  })
  @IsOptional()
  @IsString({ message: 'search deve ser um texto' })
  @MaxLength(120, { message: 'search deve ter no máximo 120 caracteres' })
  search?: string;
}
