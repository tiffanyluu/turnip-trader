import {createClient} from 'redis';

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected'));
client.connect().catch(console.error);

export const safeRedisGet = async (key: string): Promise<string | null> => {
  try {
    if (!client.isReady) return null;
    return await client.get(key);
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
};

export const safeRedisSet = async (key: string, value: string, expireSeconds: number): Promise<void> => {
  try {
    if (!client.isReady) return;
    await client.setEx(key, expireSeconds, value);
  } catch (error) {
    console.error('Redis SET error:', error);
  }
};

export default client;