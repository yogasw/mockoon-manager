import { Request, Response, NextFunction } from 'express';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({
      error: 'Missing or invalid authorization header'
    });
  }

  // Get the base64 encoded credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Get expected credentials from environment variable
  const [expectedUsername, expectedPassword] = (process.env.API_KEY || '').split(':');

  if (!username || !password || !expectedUsername || !expectedPassword) {
    return res.status(401).json({
      error: 'Invalid credentials format'
    });
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return res.status(401).json({
      error: 'Invalid credentials'
    });
  }

  next();
}
