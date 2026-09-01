import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    mediaUrl: { type: String, required: [true, 'Media URL is required'] },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    caption: { type: String, default: '' },
    eventCategory: { type: String, default: 'General' },
  },
  { timestamps: true }
);

galleryItemSchema.index({ eventCategory: 1 });

const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export default GalleryItem;
