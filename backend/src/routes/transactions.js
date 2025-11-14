import express from 'express';
import dayjs from 'dayjs';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import Book from '../models/Book.js';
import Membership from '../models/Membership.js';
import Issue from '../models/Issue.js';

const router = express.Router();


function calcFine(plannedReturn, actualReturn) {
  const lateDays = Math.max(0, dayjs(actualReturn).startOf('day').diff(dayjs(plannedReturn).startOf('day'), 'day'));
  return lateDays * 5; 
}


router.get('/availability', auth(), async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Provide text or dropdown value' });
  const items = await Book.find({ $or: [ { name: { $regex: q, $options: 'i' } }, { serialNo: { $regex: q, $options: 'i' } } ] });
  res.json(items);
});


router.post(
  '/issue',
  auth(),
  body('serialNo').isString().notEmpty(),
  body('membershipId').isString().notEmpty(),
  body('issueDate').isISO8601(),
  body('returnDate').isISO8601(),
  body('remarks').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { serialNo, membershipId, issueDate, returnDate, remarks } = req.body;
    const book = await Book.findOne({ serialNo });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.status !== 'available') return res.status(400).json({ message: 'Book not available' });

    const member = await Membership.findById(membershipId);
    if (!member || member.status !== 'active') return res.status(400).json({ message: 'Invalid membership' });

    const issueD = dayjs(issueDate);
    if (issueD.isBefore(dayjs().startOf('day'))) return res.status(400).json({ message: 'Issue Date cannot be before today' });

    const maxReturn = issueD.add(15, 'day');
    if (dayjs(returnDate).isAfter(maxReturn)) {
      return res.status(400).json({ message: 'Return Date cannot be more than 15 days from Issue Date' });
    }

    const tx = await Issue.create({
      serialNo,
      bookName: book.name,
      author: book.author,
      membershipId,
      issueDate: issueD.toDate(),
      returnDate: dayjs(returnDate).toDate(),
      remarks
    });

    book.status = 'issued';
    await book.save();

    res.status(201).json({ transaction: tx });
  }
);


router.post(
  '/return',
  auth(),
  body('serialNo').isString().notEmpty(),
  body('actualReturnDate').isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { serialNo, actualReturnDate } = req.body;
    const issue = await Issue.findOne({ serialNo, actualReturnDate: { $exists: false } }).sort({ createdAt: -1 });
    if (!issue) return res.status(404).json({ message: 'Active issue not found for this serial' });

    const fine = calcFine(issue.returnDate, actualReturnDate);
    issue.actualReturnDate = dayjs(actualReturnDate).toDate();
    issue.fineCalculated = fine;
    await issue.save();

    
    return res.json({
      transaction: issue,
      payFineRequired: fine > 0
    });
  }
);


router.post(
  '/pay-fine',
  auth(),
  body('issueId').isString().notEmpty(),
  body('finePaid').isBoolean(),
  body('remarks').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { issueId, finePaid, remarks } = req.body;
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (issue.fineCalculated > 0 && !finePaid) {
      return res.status(400).json({ message: 'Select Fine Paid to complete return' });
    }

    issue.finePaid = finePaid;
    issue.remarks = remarks || issue.remarks;
    await issue.save();

    const book = await Book.findOne({ serialNo: issue.serialNo });
    if (book) {
      book.status = 'available';
      await book.save();
    }

    res.json({ transaction: issue, status: 'completed' });
  }
);

export default router;
