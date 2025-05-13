const { redisClient } = require('../config/redis');
const CommunicationLog = require('../models/communication-log.model');
const Campaign = require('../models/campaign.model');

class MessageConsumer {
  constructor() {
    this.batchSize = 100;
    this.batchTimeout = 5000; // 5 seconds
    this.currentBatch = [];
    this.timer = null;
  }

  async start() {
    console.log('Message consumer started in development mode (no Redis)');
  }

  async processMessage(message) {
    try {
      // Create communication log
      await CommunicationLog.create({
        campaignId: message.campaignId,
        customerId: message.customerId,
        message: message.message,
        status: 'sent'
      });

      // Update campaign stats
      const campaign = await Campaign.findByPk(message.campaignId);
      if (campaign) {
        campaign.sentCount = (campaign.sentCount || 0) + 1;
        await campaign.save();
      }

      console.log(`Message sent for campaign ${message.campaignId} to customer ${message.customerId}`);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  async processBatch() {
    if (this.currentBatch.length === 0) return;

    const batch = [...this.currentBatch];
    this.currentBatch = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    try {
      const logs = await Promise.all(batch.map(async (message) => {
        // Simulate vendor API call with 90% success rate
        const success = Math.random() < 0.9;
        const status = success ? 'sent' : 'failed';
        const vendorMessageId = success ? `msg_${Date.now()}_${Math.random()}` : null;
        const errorMessage = success ? null : 'Vendor API error';

        return {
          ...message,
          status,
          vendorMessageId,
          errorMessage,
          sentAt: new Date()
        };
      }));

      // Bulk create communication logs
      await CommunicationLog.bulkCreate(logs);

      // Update campaign stats
      const campaignId = batch[0].campaignId;
      const successCount = logs.filter(log => log.status === 'sent').length;
      const failureCount = logs.filter(log => log.status === 'failed').length;

      await Campaign.increment({
        sentCount: successCount,
        failedCount: failureCount
      }, {
        where: { id: campaignId }
      });
    } catch (error) {
      console.error('Error processing message batch:', error);
    }
  }
}

module.exports = new MessageConsumer();
