import { Response } from 'express';

enum Status {
  SUCCESS = 'true',
  FAILURE = 'false',
}

abstract class ApiResponse {
  constructor(
    protected status: Status,
    protected statusCode: number,
    protected message: string,
  ) {}

  protected create<T extends ApiResponse>(res: Response, data: T): Response {
    const target: T = {} as T;
    Object.assign(target, data);
    for (const i in target) {
      if (typeof target[i] === 'undefined') {
        delete target[i];
      }
    }
    return res.status(this.statusCode).json(target);
  }

  protected createErr<T extends ApiResponse>(res: Response, data: T): Response {
    //console.log('data', data);
    const target: T = {} as T;
    Object.assign(target, data);
    const tar: T = {} as T;
    Object.assign(tar, target.message);
    console.log('tar', tar);
    return res.status(this.statusCode).json(tar);
  }

  public send(res: Response): Response {
    return this.create<ApiResponse>(res, this);
  }
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(statusCode: number, message: string, private data: T) {
    super(Status.SUCCESS, statusCode, message);
  }

  send(res: Response): Response {
    return super.create<SuccessResponse<T>>(res, this);
  }
}

export class SuccessMsgResponse<T> extends ApiResponse {
  constructor(statusCode: number, message: string) {
    super(Status.SUCCESS, statusCode, message);
  }
}

export class ErrorResponse<T> extends ApiResponse {
  constructor(statusCode: number, message: string) {
    console.log('mess', message);
    super(Status.FAILURE, statusCode, message);
  }

  send(res: Response): Response {
    return super.createErr<ErrorResponse<T>>(res, this);
  }
}

export class InternalErrorResponse<T> extends ApiResponse {
  constructor(message: string) {
    super(Status.FAILURE, 500, message);
  }
}

export class HttpException extends Error {
  constructor(status: number, message: any) {
    super(message);
  }
}

export default HttpException;
