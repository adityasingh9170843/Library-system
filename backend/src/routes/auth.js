import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'lib_token';

const router = express.Router();

// Public endpoint to create a user (admin or user)
// Example body: { "userId": "admin", "password": "admin", "role": "admin", "name": "Admin" }
router.post(
  '/create-user',
  // Accept both userId and userid for convenience
  body('userId').optional().isString().notEmpty(),
  body('userid').optional().isString().notEmpty(),
  body('password').isString().isLength({ min: 3 }),
  body('role').optional().isIn(['admin', 'user']).default('user'),
  body('name').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const rawUserId = req.body.userId || req.body.userid;
    if (!rawUserId) return res.status(400).json({ message: 'userId is required' });
    const userId = String(rawUserId).trim();
    const { password, role = 'user' } = req.body;
    const name = (req.body.name && String(req.body.name).trim()) || userId;

    const exists = await User.findOne({ userId });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, userId, passwordHash, role, active: true });
    return res.status(201).json({ user: { id: user._id, userId: user.userId, role: user.role, name: user.name } });
  }
);

router.post(
  '/login',
  body('userId').isString().notEmpty(),
  body('password').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { userId, password } = req.body;
    const user = await User.findOne({ userId, active: true });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1d' });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ user: { id: user._id, name: user.name, role: user.role, userId: user.userId } });
  }
);

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true });
});

router.get('/me', auth(true), (req, res) => {
  res.json({ user: req.user });
});
export default router;
