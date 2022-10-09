import { createClient } from "redis";
import config from "config";

let redisUrl = config.get<string>("redisDevelopmentHost");
if (process.env.NODE_ENV === "production") {
  redisUrl = config.get<string>("redisProductionHost");
}

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis client connect successfully");
    redisClient.set("try", "Hello Welcome to Express with TypeORM");
  } catch (error) {
    console.log(error);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;
