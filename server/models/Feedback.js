import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, default: '' },
    message: { type: String, required: [true, 'Message is required'] },
    type: {
      type: String,
      enum: ['Feedback', 'Grievance'],
      default: 'Feedback',
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Resolved'],
      default: 'New',
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

feedbackSchema.index({ status: 1 });
feedbackSchema.index({ type: 1 });
feedbackSchema.index({ submittedAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
