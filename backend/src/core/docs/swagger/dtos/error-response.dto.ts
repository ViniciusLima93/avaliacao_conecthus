import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 404, description: 'Código HTTP' })
  statusCode: number;

  @ApiProperty({ example: 'NotFoundException', description: 'Tipo do erro' })
  error: string;

  @ApiProperty({
    example: 'Usuário não encontrado',
    description: 'Mensagem legível do erro',
  })
  message: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({
    type: [String],
    description: 'Lista de violações encontradas no payload',
    example: [
      'Nome deve ter no mínimo 3 caracteres',
      'E-mail inválido',
      'Senha deve ter no mínimo 8 caracteres',
    ],
  })
  message: string[];
}

class DomainErrorDetailDto {
  @ApiProperty({ example: 'email', description: 'Campo que violou a regra' })
  context: string;

  @ApiProperty({ example: 'E-mail inválido' })
  message: string;
}

export class DomainValidationErrorResponseDto {
  @ApiProperty({ example: 422 })
  statusCode: number;

  @ApiProperty({ example: 'Unprocessable Entity' })
  error: string;

  @ApiProperty({ type: [String], example: ['E-mail inválido'] })
  message: string[];

  @ApiProperty({ type: [DomainErrorDetailDto] })
  details: DomainErrorDetailDto[];
}
