import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { createCrudController, createSingletonController } from '../controllers/crudController.js';

// Import all models
import CollegeProfile from '../models/CollegeProfile.js';
import HeroSlide from '../models/HeroSlide.js';
import Department from '../models/Department.js';
import Faculty from '../models/Faculty.js';
import Program from '../models/Program.js';
import AdmissionsInfo from '../models/AdmissionsInfo.js';
import FeeScheme from '../models/FeeScheme.js';
import Notice from '../models/Notice.js';
import Download from '../models/Download.js';
import SuccessStory from '../models/SuccessStory.js';
import GalleryItem from '../models/GalleryItem.js';
import Feedback from '../models/Feedback.js';
import ContactMessage from '../models/ContactMessage.js';
import Page from '../models/Page.js';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// ──────────────── Singleton Routes ────────────────

const profileCtrl = createSingletonController(CollegeProfile, 'CollegeProfile');
router.get('/college-profile', profileCtrl.get);
router.put('/college-profile', protect, authorize('Admin'), profileCtrl.update);

const admissionsCtrl = createSingletonController(AdmissionsInfo, 'AdmissionsInfo');
router.get('/admissions-info', admissionsCtrl.get);
router.put('/admissions-info', protect, authorize('Admin'), admissionsCtrl.update);

// ──────────────── CRUD Routes ────────────────

// Hero Slides
const heroCtrl = createCrudController(HeroSlide, 'HeroSlide', { defaultSort: { order: 1 } });
router.get('/hero-slides', heroCtrl.getAll);
router.get('/hero-slides/:id', heroCtrl.getById);
router.post('/hero-slides', protect, heroCtrl.create);
router.put('/hero-slides/:id', protect, heroCtrl.update);
router.delete('/hero-slides/:id', protect, heroCtrl.remove);

// Departments
const deptCtrl = createCrudController(Department, 'Department', { defaultSort: { name: 1 } });
router.get('/departments', deptCtrl.getAll);
router.get('/departments/:id', deptCtrl.getById);
router.post('/departments', protect, deptCtrl.create);
router.put('/departments/:id', protect, deptCtrl.update);
router.delete('/departments/:id', protect, deptCtrl.remove);

// Faculty (soft-delete)
const facultyCtrl = createCrudController(Faculty, 'Faculty', {
  softDelete: true,
  populateFields: 'departmentId',
  defaultSort: { name: 1 },
});
router.get('/faculty', facultyCtrl.getAll);
router.get('/faculty/:id', facultyCtrl.getById);
router.post('/faculty', protect, facultyCtrl.create);
router.put('/faculty/:id', protect, facultyCtrl.update);
router.delete('/faculty/:id', protect, facultyCtrl.remove);
router.patch('/faculty/:id/restore', protect, facultyCtrl.restore);

// Programs
const progCtrl = createCrudController(Program, 'Program', { defaultSort: { name: 1 } });
router.get('/programs', progCtrl.getAll);
router.get('/programs/:id', progCtrl.getById);
router.post('/programs', protect, authorize('Admin'), progCtrl.create);
router.put('/programs/:id', protect, authorize('Admin'), progCtrl.update);
router.delete('/programs/:id', protect, authorize('Admin'), progCtrl.remove);

// Fee Schemes (Admin only)
const feeCtrl = createCrudController(FeeScheme, 'FeeScheme', { defaultSort: { programName: 1 } });
router.get('/fee-schemes', feeCtrl.getAll);
router.get('/fee-schemes/:id', feeCtrl.getById);
router.post('/fee-schemes', protect, authorize('Admin'), feeCtrl.create);
router.put('/fee-schemes/:id', protect, authorize('Admin'), feeCtrl.update);
router.delete('/fee-schemes/:id', protect, authorize('Admin'), feeCtrl.remove);

// Notices (soft-delete)
const noticeCtrl = createCrudController(Notice, 'Notice', {
  softDelete: true,
  defaultSort: { isPinned: -1, publishDate: -1 },
});
router.get('/notices', noticeCtrl.getAll);
router.get('/notices/:id', noticeCtrl.getById);
router.post('/notices', protect, noticeCtrl.create);
router.put('/notices/:id', protect, noticeCtrl.update);
router.delete('/notices/:id', protect, noticeCtrl.remove);
router.patch('/notices/:id/restore', protect, noticeCtrl.restore);

// Downloads (soft-delete)
const dlCtrl = createCrudController(Download, 'Download', {
  softDelete: true,
  defaultSort: { uploadDate: -1 },
});
router.get('/downloads', dlCtrl.getAll);
router.get('/downloads/:id', dlCtrl.getById);
router.post('/downloads', protect, dlCtrl.create);
router.put('/downloads/:id', protect, dlCtrl.update);
router.delete('/downloads/:id', protect, dlCtrl.remove);
router.patch('/downloads/:id/restore', protect, dlCtrl.restore);

// Success Stories
const ssCtrl = createCrudController(SuccessStory, 'SuccessStory', { defaultSort: { year: -1 } });
router.get('/success-stories', ssCtrl.getAll);
router.get('/success-stories/:id', ssCtrl.getById);
router.post('/success-stories', protect, ssCtrl.create);
router.put('/success-stories/:id', protect, ssCtrl.update);
router.delete('/success-stories/:id', protect, ssCtrl.remove);

// Gallery
const galCtrl = createCrudController(GalleryItem, 'GalleryItem', { defaultSort: { createdAt: -1 } });
router.get('/gallery', galCtrl.getAll);
router.get('/gallery/:id', galCtrl.getById);
router.post('/gallery', protect, galCtrl.create);
router.put('/gallery/:id', protect, galCtrl.update);
router.delete('/gallery/:id', protect, galCtrl.remove);

// Feedback (status management, no public create here - that's in contact routes)
const fbCtrl = createCrudController(Feedback, 'Feedback', { defaultSort: { submittedAt: -1 } });
router.get('/feedback', protect, fbCtrl.getAll);
router.get('/feedback/:id', protect, fbCtrl.getById);
router.put('/feedback/:id', protect, fbCtrl.update);
router.delete('/feedback/:id', protect, fbCtrl.remove);

// Contact Messages
const cmCtrl = createCrudController(ContactMessage, 'ContactMessage', { defaultSort: { submittedAt: -1 } });
router.get('/contact-messages', protect, cmCtrl.getAll);
router.get('/contact-messages/:id', protect, cmCtrl.getById);
router.put('/contact-messages/:id', protect, cmCtrl.update);
router.delete('/contact-messages/:id', protect, cmCtrl.remove);

// Generic Pages
const pageCtrl = createCrudController(Page, 'Page', { defaultSort: { title: 1 } });
router.get('/pages', pageCtrl.getAll);
router.get('/pages/slug/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isActive: true });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (error) { next(error); }
});
router.get('/pages/:id', pageCtrl.getById);
router.post('/pages', protect, pageCtrl.create);
router.put('/pages/:id', protect, pageCtrl.update);
router.delete('/pages/:id', protect, pageCtrl.remove);

import rateLimit from 'express-rate-limit';

// Public submission rate limiter: max 5 form submissions per 10 minutes per IP
const publicFormLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many submissions from this IP. Please try again after 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ──────────────── Public Form Submissions ────────────────

router.post('/public/contact', publicFormLimiter, async (req, res, next) => {
  try {
    const msg = await ContactMessage.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) { next(error); }
});

router.post('/public/feedback', publicFormLimiter, async (req, res, next) => {
  try {
    const fb = await Feedback.create(req.body);
    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) { next(error); }
});

// ──────────────── Activity Log (Admin only, read-only) ────────────────

router.get('/activity-log', protect, authorize('Admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [logs, total] = await Promise.all([
      ActivityLog.find().sort({ timestamp: -1 }).skip(skip).limit(parseInt(limit)),
      ActivityLog.countDocuments(),
    ]);
    res.json({ success: true, data: logs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
});

export default router;
