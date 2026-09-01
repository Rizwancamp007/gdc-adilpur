import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Download title is required'] },
    category: {
      type: String,
      enum: ['Form', 'Policy', 'Prospectus', 'Other'],
      default: 'Other',
    },
    fileUrl: { type: String, required: [true, 'File URL is required'] },
    uploadDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }, // soft-delete
  },
  { timestamps: true }
);

downloadSchema.index({ category: 1 });
downloadSchema.index({ isActive: 1 });

const Download = mongoose.model('Download', downloadSchema);
export default Download;
