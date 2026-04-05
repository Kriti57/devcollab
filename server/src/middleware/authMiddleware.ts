import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

declare global{
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided',
            });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {id: string};

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401).json({
                success:false,
                message: 'Not authorized, user not found',
            });
            return;

        } 

        next();
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized, token verification failed',
        });
    }
};