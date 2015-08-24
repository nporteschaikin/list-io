var env = (process.env.NODE_ENV || 'development');

exports.name = env;
exports.isDevelopment = env == 'development';
exports.isProduction = env == 'production';
