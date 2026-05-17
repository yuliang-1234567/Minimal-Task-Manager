const rateWindowMs = 60 * 1000;
const maxRequestsPerWindow = 30;
const buckets = new Map();

const aiRateLimit = (req, res, next) => {
  const userId = req.user?._id ? String(req.user._id) : 'anonymous';
  const now = Date.now();
  const bucket = buckets.get(userId) || { count: 0, resetAt: now + rateWindowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + rateWindowMs;
  }

  bucket.count += 1;
  buckets.set(userId, bucket);

  if (bucket.count > maxRequestsPerWindow) {
    return res.status(429).json({
      success: false,
      message: 'AI 请求过于频繁，请稍后再试',
    });
  }

  return next();
};

module.exports = aiRateLimit;
