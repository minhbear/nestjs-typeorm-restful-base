import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // TODO: re-think about this.
    const { statusCode, ...rest } = this.transform(exception.getResponse());
    const status = statusCode || exception.getStatus();
    response.status(status).json({
      statusCode: status,
      ...rest,
    });
  }

  private transform(response: string | object) {
    if (!response) {
      return { statusCode: undefined };
    }

    if (response instanceof String || typeof response === 'string') {
      return { statusCode: undefined, message: response };
    }

    const { statusCode, ...rest } = { statusCode: undefined, ...response };
    return { statusCode, ...rest };
  }
}
