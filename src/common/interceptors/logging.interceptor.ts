import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

type RequestHandler = (req: Request, logger: Logger) => void;
type ResponseHandler = (
  req: Request,
  res: Response,
  body: unknown,
  logger: Logger,
) => void;
type ErrorHandler = (req: Request, error: Error, logger: Logger) => void;

const defaultRequestHandler: RequestHandler = (
  req: Request,
  logger: Logger,
) => {
  const message = `⛩ Request: ${req.method} ${req.url}`;
  logger.debug({ message });
};

const defaultResponseHandler: ResponseHandler = (
  req: Request,
  res: Response,
  _body: unknown,
  logger: Logger,
) => {
  const message = `⛩ Response: ${req.method} ${req.url} => ${res.statusCode}`;
  logger.debug({ message });
};

const defaultErrorHandler: ErrorHandler = (
  request: Request,
  error: Error,
  logger: Logger,
) => {
  if (error instanceof HttpException) {
    const statusCode: number = error.getStatus();
    const message = `✖ Error: ${request.method} ${request.url} => ${statusCode}`;

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      logger.error(
        {
          message,
          error,
        },
        error.stack,
      );
    } else {
      logger.warn({
        message,
        error,
      });
    }
  } else {
    logger.error(
      {
        message: `✖ Error: ${request.method} ${request.url}`,
      },
      error.stack,
    );
  }
};

type LoggingInterceptorConfig = {
  requestHandler: RequestHandler | null;
  responseHandler: ResponseHandler | null;
  errorHandler: ErrorHandler | null;
  context: string;
};

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger;
  private readonly config: LoggingInterceptorConfig;

  constructor(@Optional() config?: Partial<LoggingInterceptorConfig> | string) {
    const partialConfig: Partial<LoggingInterceptorConfig> =
      typeof config === 'string' ? { context: config } : { ...config };

    this.config = {
      ...partialConfig,
      requestHandler:
        partialConfig.requestHandler !== undefined
          ? partialConfig.requestHandler
          : defaultRequestHandler,
      responseHandler:
        partialConfig.responseHandler !== undefined
          ? partialConfig.responseHandler
          : defaultResponseHandler,
      errorHandler:
        partialConfig.errorHandler !== undefined
          ? partialConfig.errorHandler
          : defaultErrorHandler,
      context: partialConfig.context || LoggingInterceptor.name,
    };

    this.logger = new Logger(this.config.context);
  }

  /**
   * Intercept method, logs before and after the request being processed
   * @param context details about the current request
   * @param callHandler implements the handle method that returns an Observable
   */
  intercept(
    context: ExecutionContext,
    callHandler: CallHandler,
  ): Observable<any> {
    if (this.config.requestHandler !== null) {
      const request = context.switchToHttp().getRequest();
      this.config.requestHandler(request, this.logger);
    }

    return callHandler.handle().pipe(
      tap({
        next: (val: unknown): void => {
          this.logNext(val, context);
        },
        error: (err: Error): void => {
          this.logError(err, context);
        },
      }),
    );
  }

  /**
   * Logs the request response in success cases
   * @param body body returned
   * @param context details about the current request
   */
  private logNext(body: unknown, context: ExecutionContext): void {
    if (this.config.responseHandler != null) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      this.config.responseHandler(request, response, body, this.logger);
    }
  }

  /**
   * Logs the request response in success cases
   * @param error Error object
   * @param context details about the current request
   */
  private logError(error: Error, context: ExecutionContext): void {
    const request = context.switchToHttp().getRequest<Request>();

    if (this.config.errorHandler != null) {
      this.config.errorHandler(request, error, this.logger);
    }
  }
}
