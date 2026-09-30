import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import {
  ApiConflict,
  ApiDomainValidationError,
  ApiInvalidUuid,
  ApiNotFound,
  ApiValidationError,
} from '../../../../core/docs/swagger/decorators/api-error.decorators';
import { UserMessages } from '../../../../core/utils/user-messages';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import {
  PaginatedUserResponseDto,
  UserResponseDto,
} from '../../application/dtos/user-response.dto';

const ApiUserIdParam = () =>
  ApiParam({
    name: 'id',
    description: 'UUID do usuário',
    format: 'uuid',
    example: '3f8b2c1e-4d5a-4b6c-9e7f-1a2b3c4d5e6f',
  });

const ApiUniqueConflict = () =>
  ApiConflict('E-mail ou matrícula já pertencem a outro usuário', [
    UserMessages.EMAIL_ALREADY_EXISTS,
    UserMessages.REGISTRATION_ALREADY_EXISTS,
  ]);

export const ApiCreateUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Cria um usuário',
      description:
        'Cadastra um novo usuário. A senha é criptografada antes de ser salva e o usuário é criado **ativo** quando `isActive` não é informado.',
    }),
    ApiBody({ type: CreateUserDto }),
    ApiCreatedResponse({
      description: 'Usuário criado',
      type: UserResponseDto,
    }),
    ApiValidationError(),
    ApiUniqueConflict(),
    ApiDomainValidationError(),
  );

export const ApiFindAllUsers = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Lista usuários',
      description:
        'Retorna os usuários de forma paginada, ordenados do mais recente para o mais antigo. Use `search` para filtrar por nome, e-mail ou matrícula.',
    }),
    ApiOkResponse({
      description: 'Página de usuários',
      type: PaginatedUserResponseDto,
    }),
    ApiValidationError('Parâmetros de paginação inválidos'),
  );

export const ApiFindUserById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Busca um usuário pelo id' }),
    ApiUserIdParam(),
    ApiOkResponse({ description: 'Usuário encontrado', type: UserResponseDto }),
    ApiInvalidUuid(),
    ApiNotFound(UserMessages.NOT_FOUND),
  );

export const ApiUpdateUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualiza um usuário',
      description:
        'Atualização **parcial**: envie apenas os campos que deseja alterar. Se `password` for enviado, a nova senha é criptografada.',
    }),
    ApiUserIdParam(),
    ApiBody({
      type: UpdateUserDto,
      examples: {
        nome: { summary: 'Alterar nome', value: { name: 'Maria Souza' } },
        desativar: { summary: 'Desativar usuário', value: { isActive: false } },
        senha: {
          summary: 'Trocar senha',
          value: { password: 'Xyz789' },
        },
      },
    }),
    ApiOkResponse({ description: 'Usuário atualizado', type: UserResponseDto }),
    ApiValidationError('Payload ou id inválido'),
    ApiNotFound(UserMessages.NOT_FOUND),
    ApiUniqueConflict(),
    ApiDomainValidationError(),
  );

export const ApiDeleteUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Remove um usuário',
      description:
        'Exclusão lógica (**soft delete**): o registro recebe `deletedAt` e deixa de aparecer em todas as consultas (busca por id, listagem e pesquisa), mas continua no banco. O e-mail e a matrícula dele **continuam reservados**: novos cadastros ou edições com esses valores retornam 409.',
    }),
    ApiUserIdParam(),
    ApiNoContentResponse({ description: 'Usuário removido' }),
    ApiInvalidUuid(),
    ApiNotFound(UserMessages.NOT_FOUND),
  );
