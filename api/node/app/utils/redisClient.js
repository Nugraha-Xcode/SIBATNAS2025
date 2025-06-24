// utils/redisClient.js
const redis = require("redis");

const client = redis.createClient({
  url: "redis://redis:6379", //redis:6379,localhost:8164", // Replace <host> and <port> with your Redis host and port
  socket: {
    connectTimeout: 10000, // 10 seconds
  },
});

// Redis Event Listeners
client.on("error", (err) => console.error("Redis Client Error:", err));
client.on("connect", () => console.log("Redis client connected"));
client.on("end", () => console.log("Redis client disconnected"));

// Connect to Redis with error handling
(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

// Graceful shutdown
process.on("SIGINT", async () => {
  await client.quit();
  console.log("Redis client disconnected - exit");
  process.exit(0);
});

module.exports = client;
