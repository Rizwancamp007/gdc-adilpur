import mongoose from 'mongoose';

const feeSchemeSchema = new mongoose.Schema(
  {
    programName: { type: String, required: [true, 'Program name is required'] },
    feeBreakdown: [
      {
        label: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    effectiveYear: { type: String, default: '' },
  },
  { timestamps: true }
);

const FeeScheme = mongoose.model('FeeScheme', feeSchemeSchema);
export default FeeScheme;
