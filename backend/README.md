# Mini CRM Backend

This is the backend service for the Mini CRM Platform, built with Node.js, Express, MySQL, and Redis.

## Features

- 🔐 Google OAuth 2.0 Authentication
- 📊 Customer Data Management
- 🎯 Dynamic Audience Segmentation
- 📨 Campaign Management with Async Processing
- 🤖 AI Integration for Natural Language Processing
- 📝 Swagger API Documentation

## Prerequisites

- Node.js (v14 or higher)
- MySQL
- Redis
- Google OAuth 2.0 credentials
- OpenAI API key

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your configuration values

3. Set up the database:
   ```bash
   # Create the database
   mysql -u root -p
   CREATE DATABASE mini_crm;
   ```

4. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Documentation

Once the server is running, visit http://localhost:3000/api-docs to view the Swagger documentation.

## Architecture

### Data Flow
1. REST APIs handle data validation and authentication
2. Valid requests are published to Redis for async processing
3. Message consumer processes requests in batches
4. Campaign delivery status is updated in real-time

### AI Features
- Natural language to segment rules conversion
- AI-driven message suggestions
- Campaign performance summarization

## Directory Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Utility functions
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Segments
- `GET /api/segments` - List segments
- `POST /api/segments` - Create segment
- `GET /api/segments/:id` - Get segment
- `PUT /api/segments/:id` - Update segment
- `DELETE /api/segments/:id` - Delete segment
- `GET /api/segments/:id/preview` - Preview audience
- `POST /api/segments/natural-language` - Create from natural language

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/send` - Send campaign
- `GET /api/campaigns/:id/stats` - Get campaign stats
- `POST /api/campaigns/suggest-message` - Get AI message suggestions
