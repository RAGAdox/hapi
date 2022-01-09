const redis = require("redis");
const redisClient = redis.createClient();
const DEFAULT_EXPIRATION = 3600;
const redisSetData = async (key, value) => {
  redisClient.setEx(key, DEFAULT_EXPIRATION, value);
};
const redisDelData = async (key) => {
  redisClient.del(key);
};
const redisGetData = async (key) => {
  return redisClient.get(key);
};
module.exports = { redisClient, redisSetData, redisGetData, redisDelData };
