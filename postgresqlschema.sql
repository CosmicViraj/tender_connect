-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- companies
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100),
  industry VARCHAR(100),
  description TEXT,
  logo_url TEXT
);

-- goods_and_services
CREATE TABLE goods_and_services (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100)
);

-- tenders
CREATE TABLE tenders (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(150),
  description TEXT,
  deadline DATE,
  budget INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- applications
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  tender_id INTEGER REFERENCES tenders(id) ON DELETE CASCADE,
  applicant_company_id INTEGER REFERENCES companies(id),
  proposal TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
