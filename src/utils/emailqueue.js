const { Queue } = require("bullmq");
const Redis = require("ioredis");

const redis = new Redis({ host: "127.0.0.1", port: 6379 });

const emailQueue = new Queue("emailQueue", { connection: redis });

console.log("Connected to Redis!");
