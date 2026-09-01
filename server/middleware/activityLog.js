import ActivityLog from '../models/ActivityLog.js';

/**
 * Creates an activity log entry.
 * Call this after successful CRUD operations in controllers.
 */
export const logActivity = async ({ userId, userName, action, collectionName, documentId, description }) => {
  try {
    await ActivityLog.create({
      userId,
      userName: userName || 'Unknown',
      action,
      collectionName: collectionName || '',
      documentId: documentId ? String(documentId) : '',
      description: description || `${action} on ${collectionName}`,
    });
  } catch (error) {
    // Don't let logging failures break the main operation
    console.error('Activity log error:', error.message);
  }
};

/**
 * Express middleware version — logs after response is sent.
 * Attach req.activityLog = { action, collectionName, documentId, description } in the controller,
 * and this middleware will record it.
 */
export const activityLogMiddleware = (req, res, next) => {
  const originalSend = res.json.bind(res);

  res.json = function (body) {
    // Only log if the controller flagged an activity
    if (req.activityLog && req.user) {
      logActivity({
        userId: req.user._id,
        userName: req.user.name,
        ...req.activityLog,
      });
    }
    return originalSend(body);
  };

  next();
};
