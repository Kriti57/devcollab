import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: token,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: token,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

/**
 * @desc   Get current user profile
 * @route  GET /api/auth/me
 * @access Private (requires authentication)
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc   Update user profile
 * @route  PUT /api/auth/profile
 * @access Private
*/
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.skills) user.skills = req.body.skills;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};