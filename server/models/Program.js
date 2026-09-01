import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Program name is required'] },
    subjectsOffered: [{ type: String }],
    eligibility: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const Program = mongoose.model('Program', programSchema);
export default Program;
