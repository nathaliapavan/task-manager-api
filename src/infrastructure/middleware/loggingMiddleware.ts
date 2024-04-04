import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET;

export function logIncomingRequest(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = token ? getUserIdFromToken(token) : 'N/A';
  console.info(
    `INCOMING_REQUEST [${req.method}] ${req.originalUrl} UserID: ${userId} QueryParams: ${JSON.stringify(req.query)} Params: ${JSON.stringify(req.params)} Body: ${JSON.stringify(req.body)}`,
  );
  res.locals.userId = userId;
  next();
}

export function logOutgoingResponse(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;
  res.send = function (body: any) {
    const parsedBody = body ? JSON.stringify(hideSensitiveData(JSON.parse(body))) : 'N/A';
    console.info(
      `OUTGOING_RESPONSE [${req.method}] ${req.originalUrl} UserID: ${res.locals.userId} StatusCode ${res.statusCode} Body: ${parsedBody}`,
    );
    return originalSend.call(res, body);
  };
  next();
}

function getUserIdFromToken(token: string): string | null {
  try {
    const decodedToken: any = jwt.verify(token, secretKey as Secret);
    return decodedToken.userId;
  } catch (error) {
    return null;
  }
}

const sensitiveFields = ['password', 'token'];
function hideSensitiveData(body: any): any {
  const newBody = { ...body };
  for (const field of sensitiveFields) {
    if (newBody.hasOwnProperty(field)) {
      newBody[field] = '[HIDDEN]';
    } else if (typeof newBody[field] === 'object') {
      newBody[field] = hideSensitiveData(newBody[field]);
    }
  }
  return newBody;
}
