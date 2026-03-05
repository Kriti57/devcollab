import jwt from 'jsonwebtoken';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  const expire = process.env.JWT_EXPIRE;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // @ts-ignore
  const token = jwt.sign(
    { id: userId },
    secret,
    {
      expiresIn: expire || '7d',
    }
  );
  
  return token;
};

export default generateToken;