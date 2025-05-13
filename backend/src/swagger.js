module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Mini CRM API',
    version: '1.0.0',
    description: 'API documentation for Mini CRM Platform'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      googleAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: '/api/auth/google',
            scopes: {
              'profile': 'User profile',
              'email': 'User email'
            }
          }
        }
      }
    }
  },
  paths: {
    '/api/customers': {
      get: {
        summary: 'Get all customers',
        security: [{ googleAuth: [] }],
        responses: {
          200: {
            description: 'List of customers'
          }
        }
      },
      post: {
        summary: 'Create a new customer',
        security: [{ googleAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Customer created successfully'
          }
        }
      }
    },
    '/api/segments': {
      get: {
        summary: 'Get all segments',
        security: [{ googleAuth: [] }],
        responses: {
          200: {
            description: 'List of segments'
          }
        }
      },
      post: {
        summary: 'Create a new segment',
        security: [{ googleAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  rules: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Segment created successfully'
          }
        }
      }
    },
    '/api/campaigns': {
      get: {
        summary: 'Get all campaigns',
        security: [{ googleAuth: [] }],
        responses: {
          200: {
            description: 'List of campaigns'
          }
        }
      },
      post: {
        summary: 'Create a new campaign',
        security: [{ googleAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  segmentId: { type: 'integer' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Campaign created successfully'
          }
        }
      }
    }
  }
};
