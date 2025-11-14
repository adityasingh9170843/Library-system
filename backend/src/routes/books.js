import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Book from '../models/Book.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();


router.get(
  '/available',
  auth(false),
  async (req, res) => {
    try {
      const books = await Book.find({ status: 'Available', type: 'book' })
        .sort({ name: 1 })
        .select('name serialNo author category')
        .limit(500);
      res.json(books.map(b => ({
        id: b._id,
        serialNo: b.serialNo,
        name: b.name,
        author: b.author,
        category: b.category
      })));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


router.get(
  '/',
  auth(false),
  query('q').optional().isString(),
  query('type').optional().isIn(['book', 'movie']),
  async (req, res) => {
    const { q, type } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (q) filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
      { serialNo: { $regex: q, $options: 'i' } }
    ];
    const items = await Book.find(filter).sort({ name: 1 }).limit(200);
    res.json(items.map(b => ({
      id: b._id,
      serialNo: b.serialNo,
      name: b.name,
      author: b.author,
      category: b.category,
      status: b.status,
      type: b.type
    })));
  }
);


router.post(
  '/',
  auth(),
  requireRole('admin'),
  body('mode').isIn(['add', 'update']).default('add'),
  body('type').optional().isIn(['book', 'movie']).default('book'),
  body('serialNo').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('author').isString().notEmpty(),
  body('category').isString().notEmpty(),
  body('cost').optional().isFloat({ min: 0 }),
  body('procurementDate').optional().isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), message: 'All fields mandatory' });

    const { mode, type, serialNo, name, author, category, cost = 0, procurementDate } = req.body;

    if (mode === 'add') {
      const exists = await Book.findOne({ serialNo });
      if (exists) return res.status(400).json({ message: 'Serial already exists' });
      const book = await Book.create({ type, serialNo, name, author, category, cost, procurementDate });
      return res.status(201).json({ book });
    } else {
      const book = await Book.findOne({ serialNo });
      if (!book) return res.status(404).json({ message: 'Book not found' });
      Object.assign(book, { type, name, author, category, cost, procurementDate });
      await book.save();
      return res.json({ book });
    }
  }
);

export default router;
