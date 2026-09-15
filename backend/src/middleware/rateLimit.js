// In-memory rate limiting middleware with sliding window
const ipHits = new Map();

// Periodic cleanup of stale IP records
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipHits.entries()) {
    if (now - record.startTime > record.windowMs) {
      ipHits.delete(key);
    }
  }
}, 60000);

export function rateLimit({ windowMs = 60 * 1000, max = 30, message = 'Too many requests, please try again later.' }) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    if (!ipHits.has(key)) {
      ipHits.set(key, { count: 1, startTime: now, windowMs });
      return next();
    }

    const record = ipHits.get(key);
    if (now - record.startTime > windowMs) {
      record.count = 1;
      record.startTime = now;
      return next();
    }

    record.count++;
    if (record.count > max) {
      const retryAfter = Math.ceil((record.startTime + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: retryAfter
      });
    }

    next();
  };
}
