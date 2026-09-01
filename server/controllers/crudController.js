import { logActivity } from '../middleware/activityLog.js';
import { ApiError } from '../utils/errorHandler.js';

/**
 * Generic CRUD controller factory.
 * Generates standard list/get/create/update/delete handlers for any Mongoose model.
 * Supports soft-delete (isActive flag) for models that have it.
 */
export const createCrudController = (Model, modelName, options = {}) => {
  const { softDelete = false, populateFields = '', defaultSort = { createdAt: -1 } } = options;

  return {
    // GET all (with optional search, pagination, filters)
    getAll: async (req, res, next) => {
      try {
        const { page = 1, limit = 50, search, sort, ...filters } = req.query;
        const query = {};

        // Apply filters
        Object.keys(filters).forEach((key) => {
          if (filters[key] !== undefined && filters[key] !== '') {
            query[key] = filters[key];
          }
        });

        // Search across common text fields
        if (search) {
          const searchRegex = new RegExp(search, 'i');
          const searchFields = ['name', 'title', 'studentName', 'caption', 'subject', 'slug'];
          query.$or = searchFields.map((field) => ({ [field]: searchRegex }));
        }

        // For public API: only show active items on soft-delete models
        if (softDelete && !req.user) {
          query.isActive = true;
        }

        const sortObj = sort ? JSON.parse(sort) : defaultSort;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [items, total] = await Promise.all([
          Model.find(query)
            .populate(populateFields)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit)),
          Model.countDocuments(query),
        ]);

        res.status(200).json({
          success: true,
          count: items.length,
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          data: items,
        });
      } catch (error) {
        next(error);
      }
    },

    // GET single by ID
    getById: async (req, res, next) => {
      try {
        const item = await Model.findById(req.params.id).populate(populateFields);

        if (!item) {
          throw new ApiError(404, `${modelName} not found`);
        }

        // If soft-delete model and accessed publicly, check isActive
        if (softDelete && !req.user && item.isActive === false) {
          throw new ApiError(404, `${modelName} not found`);
        }

        res.status(200).json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },

    // POST create
    create: async (req, res, next) => {
      try {
        const item = await Model.create(req.body);

        await logActivity({
          userId: req.user._id,
          userName: req.user.name,
          action: 'create',
          collectionName: modelName,
          documentId: item._id,
          description: `Created ${modelName}: ${item.name || item.title || item.studentName || item._id}`,
        });

        res.status(201).json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },

    // PUT update
    update: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        }).populate(populateFields);

        if (!item) {
          throw new ApiError(404, `${modelName} not found`);
        }

        await logActivity({
          userId: req.user._id,
          userName: req.user.name,
          action: 'update',
          collectionName: modelName,
          documentId: item._id,
          description: `Updated ${modelName}: ${item.name || item.title || item.studentName || item._id}`,
        });

        res.status(200).json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },

    // DELETE (hard or soft)
    remove: async (req, res, next) => {
      try {
        let item;

        if (softDelete) {
          // Soft delete — set isActive to false
          item = await Model.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
          );
        } else {
          item = await Model.findByIdAndDelete(req.params.id);
        }

        if (!item) {
          throw new ApiError(404, `${modelName} not found`);
        }

        await logActivity({
          userId: req.user._id,
          userName: req.user.name,
          action: 'delete',
          collectionName: modelName,
          documentId: item._id,
          description: `${softDelete ? 'Soft-deleted' : 'Deleted'} ${modelName}: ${item.name || item.title || item.studentName || item._id}`,
        });

        res.status(200).json({
          success: true,
          message: `${modelName} ${softDelete ? 'deactivated' : 'deleted'} successfully`,
        });
      } catch (error) {
        next(error);
      }
    },

    // PATCH restore (soft-delete only)
    ...(softDelete && {
      restore: async (req, res, next) => {
        try {
          const item = await Model.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
          );

          if (!item) {
            throw new ApiError(404, `${modelName} not found`);
          }

          await logActivity({
            userId: req.user._id,
            userName: req.user.name,
            action: 'update',
            collectionName: modelName,
            documentId: item._id,
            description: `Restored ${modelName}: ${item.name || item.title || item.studentName || item._id}`,
          });

          res.status(200).json({ success: true, data: item });
        } catch (error) {
          next(error);
        }
      },
    }),
  };
};

/**
 * Singleton controller factory — for collections with only one document (CollegeProfile, AdmissionsInfo).
 */
export const createSingletonController = (Model, modelName) => {
  return {
    get: async (req, res, next) => {
      try {
        let doc = await Model.findOne();
        if (!doc) {
          doc = await Model.create({});
        }
        res.status(200).json({ success: true, data: doc });
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        let doc = await Model.findOne();
        if (!doc) {
          doc = await Model.create(req.body);
        } else {
          Object.assign(doc, req.body);
          await doc.save();
        }

        await logActivity({
          userId: req.user._id,
          userName: req.user.name,
          action: 'update',
          collectionName: modelName,
          documentId: doc._id,
          description: `Updated ${modelName}`,
        });

        res.status(200).json({ success: true, data: doc });
      } catch (error) {
        next(error);
      }
    },
  };
};
