import User from '../models/User.js';
import { ApiError } from '../utils/errorHandler.js';
import { logActivity } from '../middleware/activityLog.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Admin only
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, 'Please provide name, email, and password');
    }

    if (password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      throw new ApiError(400, 'A user with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password, // pre-save hook hashes it
      role: role || 'Clerk',
    });

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      action: 'create',
      collectionName: 'Users',
      documentId: user._id,
      description: `Created user: ${user.name} (${user.role})`,
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin only
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (password && password.length >= 6) {
      user.passwordHash = password; // pre-save hook hashes it
    }

    await user.save();

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      action: 'update',
      collectionName: 'Users',
      documentId: user._id,
      description: `Updated user: ${user.name}`,
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin only
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      throw new ApiError(400, 'You cannot delete your own account');
    }

    await User.findByIdAndDelete(req.params.id);

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      action: 'delete',
      collectionName: 'Users',
      documentId: user._id,
      description: `Deleted user: ${user.name}`,
    });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
