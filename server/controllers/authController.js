import User from '../models/User.js';
import { ApiError } from '../utils/errorHandler.js';
import { generateToken, setTokenCookie } from '../utils/jwt.js';
import { logActivity } from '../middleware/activityLog.js';
import { validatePasswordStrength } from '../middleware/security.js';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);

    // Log login activity
    await logActivity({
      userId: user._id,
      userName: user.name,
      action: 'login',
      collectionName: 'Users',
      documentId: user._id,
      description: `${user.name} logged in`,
    });

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (clear cookie)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await logActivity({
        userId: req.user._id,
        userName: req.user.name,
        action: 'logout',
        collectionName: 'Users',
        documentId: req.user._id,
        description: `${req.user.name} logged out`,
      });
    }

    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'Please provide current and new password');
    }

    const passwordCheck = validatePasswordStrength(newPassword);
    if (!passwordCheck.valid) {
      throw new ApiError(400, passwordCheck.message);
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    user.passwordHash = newPassword; // pre-save hook will hash it
    await user.save();

    await logActivity({
      userId: user._id,
      userName: user.name,
      action: 'update',
      collectionName: 'Users',
      documentId: user._id,
      description: `${user.name} changed their password`,
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
