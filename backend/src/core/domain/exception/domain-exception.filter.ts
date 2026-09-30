import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { NotificationErrors } from '../notification/notification.errors';
import {
  ConflictException,
  DomainException,
  NotFoundException,
} from './domain.exception';

@Catch(DomainException, NotificationErrors)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException | NotificationErrors, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof NotificationErrors) {
      const status = HttpStatus.UNPROCESSABLE_ENTITY;
      response.status(status).json({
        statusCode: status,
        error: 'Unprocessable Entity',
        message: exception.errors.map((error) => error.message),
        details: exception.errors,
      });
      return;
    }

    const status = this.statusFor(exception);
    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }

  private statusFor(exception: DomainException): HttpStatus {
    if (exception instanceof NotFoundException) return HttpStatus.NOT_FOUND;
    if (exception instanceof ConflictException) return HttpStatus.CONFLICT;
    return HttpStatus.BAD_REQUEST;
  }
}
