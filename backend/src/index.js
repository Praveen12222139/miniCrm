require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');

// Import database and passport config
const sequelize = require('./config/database');
require('./config/passport');
const { connectRedis } = require('./config/redis');
const messageConsumer = require('./services/message-consumer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
// Import session config
require('./config/session')(app);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/customers', require('./routes/customer.routes'));
app.use('/api/campaigns', require('./routes/campaign.routes'));
app.use('/api/segments', require('./routes/segment.routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync();
    console.log('Database tables synchronized');

    // Connect to Redis
    await connectRedis();
    console.log('Redis connected successfully');

    // Start message consumer
    await messageConsumer.start();
    console.log('Message consumer started');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
