import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    //here we just kept it simple
    // In a real app, you will like to put useId or IP address as your key instead of "my-rate-limit" as seen below.
    const { success } = await ratelimit.limit("my-rate-limit");
    if (!success) {
      return res.status(429).json({
        massage: "Too many request, Please try again later.",
      });
    }
    next();
  } catch (error) {
    console.log("Rate Limit Error", error);
    next(error);
  }
};

export default rateLimiter;
