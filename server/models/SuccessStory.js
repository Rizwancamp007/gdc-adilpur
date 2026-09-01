import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema(
  {
    studentName: { type: String, required: [true, 'Student name is required'] },
    photoUrl: { type: String, default: '' },
    achievement: { type: String, required: [true, 'Achievement description is required'] },
    year: { type: String, default: '' },
  },
  { timestamps: true }
);

const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
export default SuccessStory;
