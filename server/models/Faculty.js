import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Faculty name is required'] },
    designation: { type: String, default: '' },
    qualification: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    subject: { type: String, default: '' },
    isActive: { type: Boolean, default: true }, // soft-delete
  },
  { timestamps: true }
);

facultySchema.index({ departmentId: 1 });
facultySchema.index({ isActive: 1 });

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;
