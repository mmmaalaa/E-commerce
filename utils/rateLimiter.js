import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next, options) => {
    const retrySecs = Math.ceil(
      (req.rateLimit.resetTime - new Date()) / 1000 / 60
    );
    res.status(options.statusCode).json({
      success: false,
      message: `Too many requests. Please try again in ${retrySecs} minutes.`,
    });
  },
});

export default limiter;
