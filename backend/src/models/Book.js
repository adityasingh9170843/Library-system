import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['book', 'movie'], default: 'book' },
    serialNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['available', 'issued'], default: 'available' },
    cost: { type: Number, default: 0 },
    procurementDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Book', BookSchema);
