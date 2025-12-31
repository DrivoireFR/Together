export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'together-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  rememberExpiresIn: process.env.JWT_REMEMBER_EXPIRES_IN || '30d',
};
