import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('POST /api/simulate', () => {
  it('should return valid turnip week data', async () => {
    const response = await request(app)
      .post('/api/simulate')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('pattern');
    expect(response.body.data).toHaveProperty('buyPrice');
    expect(response.body.data).toHaveProperty('prices');
    expect(response.body.data).toHaveProperty('advice');
    expect(response.body.data.prices).toHaveLength(12);
    expect(['large_spike', 'small_spike', 'decreasing', 'random']).toContain(response.body.data.pattern);
  });
});