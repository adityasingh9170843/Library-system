import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();


router.post(
  '/',
  auth(),
  requireRole('admin'),
  body('mode').isIn(['new', 'existing']).default('new'),
  body('name').isString().notEmpty(),
  body('userId').isString().notEmpty(),
  body('password').optional().isString().isLength({ min: 3 }),
  body('active').optional().isBoolean(),
  body('role').optional().isIn(['admin', 'user']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { mode, name, userId, password, role = 'user', active = true } = req.body;

    if (mode === 'new') {
      const exists = await User.findOne({ userId });
      if (exists) return res.status(400).json({ message: 'User already exists' });
      const passwordHash = await bcrypt.hash(password || 'password', 10);
      const user = await User.create({ name, userId, passwordHash, role, active });
      return res.status(201).json({ user });
    } else {
      const user = await User.findOne({ userId });
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.name = name;
      user.role = role;
      user.active = active;
      if (password) user.passwordHash = await bcrypt.hash(password, 10);
      await user.save();
      return res.json({ user });
    }
  }
);

export default router;
