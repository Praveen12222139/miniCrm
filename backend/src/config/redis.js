// Mock Redis client for development
const mockRedisClient = {
  connect: async () => console.log('Using mock Redis client'),
  publish: async () => {},
  subscribe: async () => {},
  on: () => {}
};

const connectRedis = async () => {
  console.log('Using mock Redis client - messages will not be processed');
};

module.exports = {
  redisClient: mockRedisClient,
  connectRedis
};
