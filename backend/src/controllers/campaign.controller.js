const Campaign = require('../models/campaign.model');
const Segment = require('../models/segment.model');
const Customer = require('../models/customer.model');
const CommunicationLog = require('../models/communication-log.model');
const { redisClient } = require('../config/redis');
const { evaluateSegmentRules } = require('../utils/segment-evaluator');
const { OpenAI } = require('openai');
const sequelize = require('../config/database');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      where: { createdBy: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const [updated] = await Campaign.update(req.body, {
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    const campaign = await Campaign.findByPk(req.params.id);
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const deleted = await Campaign.destroy({
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.scheduleCampaign = async (req, res) => {
  try {
    const { scheduledAt } = req.body;
    const campaign = await Campaign.findOne({
      where: { id: req.params.id, createdBy: req.user.id }
    });
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    campaign.scheduledAt = scheduledAt;
    await campaign.save();
    
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const segment = await Segment.findByPk(campaign.segmentId);
    const customers = await Customer.findAll();
    const targetCustomers = customers.filter(customer => 
      evaluateSegmentRules(customer, segment.rules)
    );

    // Update campaign status and audience size
    campaign.status = 'running';
    campaign.audienceSize = targetCustomers.length;
    await campaign.save();

    // Publish messages to Redis for async processing
    for (const customer of targetCustomers) {
      const message = {
        campaignId: campaign.id,
        customerId: customer.id,
        message: campaign.message.replace('{name}', customer.name)
      };
      await redisClient.publish('campaign:messages', JSON.stringify(message));
    }

    res.json({ 
      message: 'Campaign started',
      audienceSize: targetCustomers.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCampaignStats = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const stats = await CommunicationLog.findAll({
      where: { campaignId: campaign.id },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Generate AI summary
    const summary = await generateCampaignSummary(campaign, stats);

    res.json({
      stats,
      summary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.suggestMessage = async (req, res) => {
  try {
    const { objective, segmentId } = req.body;
    
    const segment = await Segment.findByPk(segmentId);
    if (!segment) {
      return res.status(404).json({ error: 'Segment not found' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Generate personalized campaign messages based on the objective and audience segment."
        },
        {
          role: "user",
          content: `Generate 3 message variants for a campaign with objective: "${objective}" targeting audience: ${JSON.stringify(segment.rules)}`
        }
      ]
    });

    const suggestions = JSON.parse(completion.choices[0].message.content);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function generateCampaignSummary(campaign, stats) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Generate a human-readable summary of campaign performance stats."
      },
      {
        role: "user",
        content: `Generate a summary for campaign "${campaign.name}" with stats: ${JSON.stringify(stats)}`
      }
    ]
  });

  return completion.choices[0].message.content;
}
