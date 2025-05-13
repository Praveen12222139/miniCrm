const router = require('express').Router();
const campaignController = require('../controllers/campaign.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Campaign routes
router.post('/', campaignController.createCampaign);
router.get('/', campaignController.getCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.put('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);
router.post('/:id/send', campaignController.sendCampaign);
router.get('/:id/stats', campaignController.getCampaignStats);
router.post('/suggest-message', campaignController.suggestMessage);
router.post('/:id/schedule', campaignController.scheduleCampaign);

module.exports = router;
