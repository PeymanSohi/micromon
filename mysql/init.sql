-- Create the database
CREATE DATABASE IF NOT EXISTS micromon;

-- Switch to the new database
USE micromon;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL
);

-- Insert the admin user
INSERT INTO users (username, password, role)
VALUES 
  ('${ADMIN_USERNAME}', '${ADMIN_PASSWORD}', 'admin'),
  ('${USER_USERNAME}', '${USER_PASSWORD}', 'user');

