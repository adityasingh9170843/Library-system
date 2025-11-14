import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
  {
    serialNo: { type: String, required: true },
    bookName: { type: String, required: true },
    author: { type: String, required: true },
    membershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
    issueDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    actualReturnDate: { type: Date },
    remarks: { type: String },
    fineCalculated: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Issue', IssueSchema);
