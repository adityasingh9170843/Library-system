import express from 'express';
import dayjs from 'dayjs';
import { body, validationResult } from 'express-validator';
import { auth, requireRole } from '../middleware/auth.js';
import Membership from '../models/Membership.js';

const router = express.Router();

function calcEndDate(startDate, duration) {
  
  if (duration === '1y') return dayjs(startDate).add(1, 'year').toDate();
  if (duration === '2y') return dayjs(startDate).add(2, 'year').toDate();
  return dayjs(startDate).add(6, 'month').toDate();
}


router.post(
  '/',
  auth(),
  requireRole('admin'),
  body('memberName').isString().notEmpty(),
  body('contactNumber').isString().notEmpty(),
  body('contactAddress').isString().notEmpty(),
  body('aadharCardNo').isString().notEmpty(),
  body('startDate').isISO8601(),
  body('duration').optional().isIn(['6m', '1y', '2y']).default('6m'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { memberName, contactNumber, contactAddress, aadharCardNo, startDate, duration = '6m' } = req.body;
    const endDate = calcEndDate(startDate, duration);
    const membership = await Membership.create({ memberName, contactNumber, contactAddress, aadharCardNo, startDate, endDate, status: 'active' });
    res.status(201).json({ membership });
  }
);


router.put(
  '/:id',
  auth(),
  requireRole('admin'),
  body('action').isIn(['extend', 'cancel']).default('extend'),
  body('duration').optional().isIn(['6m', '1y', '2y']).default('6m'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { id } = req.params;
    const { action, duration } = req.body;
    const m = await Membership.findById(id);
    if (!m) return res.status(404).json({ message: 'Membership not found' });
    if (action === 'cancel') {
      m.status = 'inactive';
    } else {
      m.endDate = calcEndDate(m.endDate, duration);
    }
    await m.save();
    res.json({ membership: m });
  }
);

export default router;
