import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema(
  {
    memberName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    contactAddress: { type: String, required: true },
    aadharCardNo: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    amountPendingFine: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Membership', MembershipSchema);
