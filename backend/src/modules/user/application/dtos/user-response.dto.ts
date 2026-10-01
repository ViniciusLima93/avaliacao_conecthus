import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResult } from '../../../../core/pagination/paginated-result';
import { UserEntity } from '../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'Identificador do usuário',
    format: 'uuid',
    example: '3f8b2c1e-4d5a-4b6c-9e7f-1a2b3c4d5e6f',
  })
  id: string;

  @ApiProperty({ description: 'Nome completo', example: 'Maria Silva' })
  name: string;

  @ApiProperty({ description: 'Matrícula', example: '2024001' })
  registration: string;

  @ApiProperty({
    description: 'E-mail (minúsculas)',
    format: 'email',
    example: 'maria.silva@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2026-09-30T00:26:19.500Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2026-09-30T00:26:19.500Z',
  })
  updatedAt: Date;

  static fromEntity(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      registration: user.registration,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

class PaginationMetaDto {
  @ApiProperty({ description: 'Página atual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Itens por página', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total de registros', example: 42 })
  total: number;

  @ApiProperty({ description: 'Total de páginas', example: 5 })
  totalPages: number;
}

export class PaginatedUserResponseDto implements PaginatedResult<UserResponseDto> {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
