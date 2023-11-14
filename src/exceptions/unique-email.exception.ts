import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoError)
export class UniqueConstraintExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = HttpStatus.CONFLICT; // 409 Conflict for unique constraint violation

    if (exception.code === 11000) {
      // MongoDB error code for duplicate key (unique constraint violation)
      response.status(status).json({
        statusCode: status,
        message: 'Email already exists',
        error: 'Conflict',
      });
    } else {
      // Handle other Mongo errors or rethrow the exception for other types of errors
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      });
    }
  }
}
