import mongoose from 'mongoose';

const admissionsInfoSchema = new mongoose.Schema(
  {
    eligibilityText: { type: String, default: '' },
    howToApplyText: { type: String, default: '' },
    importantDatesText: { type: String, default: '' },
  },
  { timestamps: true }
);

const AdmissionsInfo = mongoose.model('AdmissionsInfo', admissionsInfoSchema);
export default AdmissionsInfo;
