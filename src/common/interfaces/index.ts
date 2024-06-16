import { Request } from 'express';

export class ISimpleResponse {
  success: boolean;
}

export interface IRequestWithCurrentAccountSession extends Request {
  user: {
    id: number;
    sessionId: number;
  };
}
