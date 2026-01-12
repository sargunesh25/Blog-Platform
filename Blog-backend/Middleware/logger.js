const logger = (req, res, next) => {
  console.log(`[LOG]: ${req.method} ${req.url}`);
  next();
};

module.exports = logger;