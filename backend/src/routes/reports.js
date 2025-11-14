import express from 'express';
import { auth } from '../middleware/auth.js';
import Book from '../models/Book.js';
import Membership from '../models/Membership.js';
import Issue from '../models/Issue.js';
import dayjs from 'dayjs';

const router = express.Router();

// Reports accessible to both roles
router.get('/books', auth(), async (_req, res) => {
  const items = await Book.find({}).sort({ serialNo: 1 });
  res.json(items);
});

router.get('/movies', auth(), async (_req, res) => {
  const items = await Book.find({ type: 'movie' }).sort({ serialNo: 1 });
  res.json(items);
});

router.get('/memberships', auth(), async (_req, res) => {
  const items = await Membership.find({}).sort({ createdAt: -1 });
  res.json(items);
});

router.get('/active-issues', auth(), async (_req, res) => {
  const items = await Issue.find({ actualReturnDate: { $exists: false } }).sort({ createdAt: -1 });
  res.json(items);
});

router.get('/overdue-returns', auth(), async (_req, res) => {
  const now = dayjs().toDate();
  const items = await Issue.find({ actualReturnDate: { $exists: false }, returnDate: { $lt: now } }).sort({ returnDate: 1 });
  res.json(items);
});

router.get('/pending-issue-requests', auth(), async (_req, res) => {
  // For simplicity we treat all active issues as requests already fulfilled; leaving stub here
  res.json([]);
});

export default router;
