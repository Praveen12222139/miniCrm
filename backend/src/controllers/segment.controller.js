const Segment = require('../models/segment.model');
const Customer = require('../models/customer.model');
const { evaluateSegmentRules } = require('../utils/segment-evaluator');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.createSegment = async (req, res) => {
  try {
    const segment = await Segment.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(segment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSegments = async (req, res) => {
  try {
    const segments = await Segment.findAll({
      where: { createdBy: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(segments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSegment = async (req, res) => {
  try {
    const [updated] = await Segment.update(req.body, {
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Segment not found' });
    }
    const segment = await Segment.findByPk(req.params.id);
    res.json(segment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSegment = async (req, res) => {
  try {
    const deleted = await Segment.destroy({
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Segment not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSegments = async (req, res) => {
  try {
    const segments = await Segment.findAll({
      where: { createdBy: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(segments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findOne({
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!segment) {
      return res.status(404).json({ error: 'Segment not found' });
    }
    res.json(segment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.previewAudience = async (req, res) => {
  try {
    const segment = await Segment.findByPk(req.params.id);
    if (!segment) {
      return res.status(404).json({ error: 'Segment not found' });
    }

    const customers = await Customer.findAll();
    const matchingCustomers = customers.filter(customer => 
      evaluateSegmentRules(customer, segment.rules)
    );

    res.json({
      audienceSize: matchingCustomers.length,
      sampleCustomers: matchingCustomers.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFromNaturalLanguage = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Convert natural language segment descriptions into JSON rules. Example: 'People who spent over 5000 and visited less than 3 times' -> {operator: 'AND', conditions: [{field: 'totalSpend', operator: '>', value: 5000}, {field: 'visitCount', operator: '<', value: 3}]}"
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const rules = JSON.parse(completion.choices[0].message.content);
    
    res.json({ rules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
