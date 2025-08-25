import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const setupDatabase = async () => {
  const defaultPool = new Pool({
    host: 'localhost',
    port: 5432,
    user: process.env.DB_USER || 'tiffanyluu',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DEFAULT_DB || 'tiffanyluu'
  });

  let appPool: Pool | null = null;

  try {
    console.log('Setting up database and tables...');
    
    console.log('Creating database turnip_trader...');
    try {
      await defaultPool.query('CREATE DATABASE turnip_trader;');
      console.log('Database created!');
    } catch (error: any) {
      if (error.code === '42P04') {
        console.log('Database already exists, continuing...');
      } else {
        throw error;
      }
    }
    
    await defaultPool.end();
    
    appPool = new Pool({
      host: 'localhost',
      port: 5432,
      user: process.env.DB_USER || 'tiffanyluu',
      password: process.env.DB_PASSWORD || '',
      database: 'turnip_trader'
    });

    console.log('Setting up tables...');
    
    console.log('Enabling vector extension...');
    await appPool.query('CREATE EXTENSION IF NOT EXISTS vector;');
    
    console.log('Creating guides table...');
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS guides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        embedding vector(1536),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating turnip_weeks table...');
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS turnip_weeks (
        id SERIAL PRIMARY KEY,
        week_date DATE NOT NULL,
        pattern_type VARCHAR(50) NOT NULL CHECK (pattern_type IN ('large_spike', 'small_spike', 'decreasing', 'random')),
        prices JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create indexes for better performance
    console.log('⚡ Creating performance indexes...');
    await appPool.query(`
      CREATE INDEX IF NOT EXISTS idx_guides_embedding 
      ON guides USING ivfflat (embedding vector_cosine_ops) 
      WITH (lists = 100);
    `);
    
    await appPool.query(`
      CREATE INDEX IF NOT EXISTS idx_guides_title 
      ON guides (title);
    `);
    
    await appPool.query(`
      CREATE INDEX IF NOT EXISTS idx_turnip_weeks_date 
      ON turnip_weeks (week_date);
    `);
    
    await appPool.query(`
      CREATE INDEX IF NOT EXISTS idx_turnip_weeks_pattern 
      ON turnip_weeks (pattern_type);
    `);
    
    console.log('Database setup complete!');
    console.log('Tables created:');
    console.log('   - guides (for RAG system)');
    console.log('   - turnip_weeks (for simulated data)');
    console.log('Ready to run: npm run seed-guides');
    
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  } finally {
    if (appPool) {
      await appPool.end();
    }
  }
};

// Run if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Database setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export { setupDatabase };