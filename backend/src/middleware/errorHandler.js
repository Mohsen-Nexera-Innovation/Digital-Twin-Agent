import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status,
    }
  });
}
