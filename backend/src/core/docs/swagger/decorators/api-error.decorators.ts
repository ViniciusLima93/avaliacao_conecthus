import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  DomainValidationErrorResponseDto,
  ErrorResponseDto,
  ValidationErrorResponseDto,
} from '../dtos/error-response.dto';

export const ApiValidationError = (description = 'Payload inválido') =>
  applyDecorators(
    ApiBadRequestResponse({ description, type: ValidationErrorResponseDto }),
  );

export const ApiInvalidUuid = () =>
  applyDecorators(
    ApiBadRequestResponse({
      description: 'O parâmetro `id` não é um UUID válido',
      schema: {
        example: {
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid is expected)',
        },
      },
    }),
  );

export const ApiNotFound = (message: string) =>
  applyDecorators(
    ApiNotFoundResponse({
      description: message,
      type: ErrorResponseDto,
      example: { statusCode: 404, error: 'NotFoundException', message },
    }),
  );

export const ApiConflict = (description: string, messages: string[]) =>
  applyDecorators(
    ApiConflictResponse({
      description,
      type: ErrorResponseDto,
      examples: Object.fromEntries(
        messages.map((message) => [
          message,
          {
            summary: message,
            value: { statusCode: 409, error: 'ConflictException', message },
          },
        ]),
      ),
    }),
  );

export const ApiDomainValidationError = () =>
  applyDecorators(
    ApiUnprocessableEntityResponse({
      description: 'Os dados violam uma regra de domínio da entidade',
      type: DomainValidationErrorResponseDto,
    }),
  );
