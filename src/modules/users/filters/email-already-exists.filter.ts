import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EmailAlreadyExistError } from '../errors/user.error';
import { Response } from 'express';

@Catch(EmailAlreadyExistError)
export class EmailAlreadyExistFilter implements ExceptionFilter {
  catch(exception: EmailAlreadyExistError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>(); //<- Tipo genérico do Express

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
