import { Pool } from "pg";
import config from "../config/env";

export const pool = new Pool({ connectionString: config.connection_string });

const initDb = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),

            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
      `);

  await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
                  id SERIAL PRIMARY KEY,
                  title VARCHAR(150) NOT NULL,
                  description TEXT NOT NULL CHECK (char_length(description) >= 20),
                  type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
                  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
                  reporter_id INT NOT NULL,
             
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
            `);

  await pool.query(`
            CREATE OR REPLACE FUNCTION update_modified_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE 'plpgsql';    
                  `);

  await pool.query(`
            DROP TRIGGER IF EXISTS update_at_users ON users;
            CREATE TRIGGER update_at_users
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE PROCEDURE update_modified_column();
  `);

  await pool.query(`
            DROP TRIGGER IF EXISTS update_at_issues ON issues;
            CREATE TRIGGER update_at_issues
            BEFORE UPDATE ON issues
            FOR EACH ROW
            EXECUTE PROCEDURE update_modified_column();
  `);
};

export default initDb;
