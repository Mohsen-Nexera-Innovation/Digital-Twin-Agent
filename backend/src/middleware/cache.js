const cache = new Map();

export function cacheMiddleware(ttlSeconds = 300) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttlSeconds * 1000) {
      return res.json(cached.data);
    }
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, { data, timestamp: Date.now() });
      return originalJson(data);
    };
    next();
  };
}

export function clearCache() {
  cache.clear();
}
