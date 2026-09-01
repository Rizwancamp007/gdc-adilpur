import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Notice title is required'] },
    body: { type: String, default: '' },
    category: {
      type: String,
      enum: ['General', 'Academic', 'Examination', 'Admission', 'Administrative', 'Other'],
      default: 'General',
    },
    attachmentUrl: { type: String, default: '' },
    isPinned: { type: Boolean, default: false },
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true }, // soft-delete
  },
  { timestamps: true }
);

noticeSchema.index({ publishDate: -1 });
noticeSchema.index({ isPinned: -1, publishDate: -1 });
noticeSchema.index({ isActive: 1 });
noticeSchema.index({ category: 1 });

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
