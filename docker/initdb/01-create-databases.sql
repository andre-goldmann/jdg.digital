-- Create databases
CREATE DATABASE tiims_user_data ENCODING 'UTF8';
--CREATE DATABASE db_two ENCODING 'UTF8';

-- Optional: create roles and grant privileges
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'tiims_user_data') THEN
CREATE ROLE tiims_user_data LOGIN PASSWORD 'pwd';
END IF;
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'user_two') THEN
CREATE ROLE user_two LOGIN PASSWORD 'pwd';
END IF;
END$$;

-- Grant ownership/privileges
ALTER DATABASE tiims_user_data OWNER TO tiims_user_data;
--ALTER DATABASE db_two OWNER TO user_two;