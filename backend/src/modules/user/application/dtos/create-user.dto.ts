import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserMessages } from '../../../../core/utils/user-messages';
import {
  NAME_PATTERN,
  PASSWORD_LENGTH,
  PASSWORD_PATTERN,
  REGISTRATION_PATTERN,
} from '../../domain/validators/user.rules';

export class CreateUserDto {
  @ApiProperty({
    description:
      'Nome completo do usuário: apenas letras (com acentos), separadas por um espaço',
    example: 'Maria Silva',
    minLength: 3,
    maxLength: 30,
  })
  @IsString({ message: UserMessages.NAME_STRING })
  @IsNotEmpty({ message: UserMessages.NAME_REQUIRED })
  @Matches(NAME_PATTERN, { message: UserMessages.NAME_LETTERS })
  @MinLength(3, { message: UserMessages.NAME_MIN })
  @MaxLength(30, { message: UserMessages.NAME_MAX })
  name: string;

  @ApiProperty({
    description: 'Matrícula do usuário (única, apenas números)',
    example: '2024001',
    minLength: 4,
    maxLength: 10,
    pattern: '^\\d+$',
  })
  @IsString({ message: UserMessages.REGISTRATION_STRING })
  @IsNotEmpty({ message: UserMessages.REGISTRATION_REQUIRED })
  @Matches(REGISTRATION_PATTERN, { message: UserMessages.REGISTRATION_DIGITS })
  @MinLength(4, { message: UserMessages.REGISTRATION_MIN })
  @MaxLength(10, { message: UserMessages.REGISTRATION_MAX })
  registration: string;

  @ApiProperty({
    description: 'E-mail do usuário (único, salvo em minúsculas)',
    example: 'maria.silva@email.com',
    format: 'email',
    maxLength: 40,
  })
  @IsEmail({}, { message: UserMessages.EMAIL_INVALID })
  @MaxLength(40, { message: UserMessages.EMAIL_MAX })
  email: string;

  @ApiProperty({
    description:
      'Senha: exatamente 6 caracteres alfanuméricos (letras e números). É criptografada com bcrypt antes de ser salva',
    example: 'Abc123',
    format: 'password',
    minLength: PASSWORD_LENGTH,
    maxLength: PASSWORD_LENGTH,
    pattern: '^[A-Za-z0-9]+$',
    writeOnly: true,
  })
  @IsString({ message: UserMessages.PASSWORD_STRING })
  @Matches(PASSWORD_PATTERN, { message: UserMessages.PASSWORD_ALPHANUMERIC })
  @Length(PASSWORD_LENGTH, PASSWORD_LENGTH, {
    message: UserMessages.PASSWORD_LENGTH,
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Indica se o usuário está ativo',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: UserMessages.IS_ACTIVE_BOOLEAN })
  isActive?: boolean;
}
