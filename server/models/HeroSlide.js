import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: [true, 'Image URL is required'] },
    caption: { type: String, default: '' },
    linkUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

heroSlideSchema.index({ order: 1 });

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);
export default HeroSlide;
