import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: { type: String, default: '' },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'login', 'logout'],
      required: true,
    },
    collectionName: { type: String, default: '' },
    documentId: { type: String, default: '' },
    description: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ collectionName: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
