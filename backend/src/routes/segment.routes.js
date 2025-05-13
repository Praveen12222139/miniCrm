const router = require('express').Router();
const segmentController = require('../controllers/segment.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Segment routes
router.post('/', segmentController.createSegment);
router.get('/', segmentController.getSegments);
router.get('/:id', segmentController.getSegmentById);
router.put('/:id', segmentController.updateSegment);
router.delete('/:id', segmentController.deleteSegment);
router.get('/:id/preview', segmentController.previewAudience);
router.post('/natural-language', segmentController.createFromNaturalLanguage);

module.exports = router;
