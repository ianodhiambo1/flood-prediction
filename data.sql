-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS flood;

-- Use the database
USE flood;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20),
    Location VARCHAR(100) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    NotificationPreference ENUM('Email', 'SMS', 'Both') NOT NULL
);

-- Insert sample data into Users table
INSERT INTO Users (Username, Email, PhoneNumber, Location, Password, NotificationPreference) 
VALUES 
('user1', 'user1@example.com', '1234567890', 'Madaraka', 'hashed_password_1', 'Email'),
('user2', 'user2@example.com', '0987654321', 'Westlands', 'hashed_password_2', 'SMS'),
('user3', 'user3@example.com', '1112223333', 'Parklands', 'hashed_password_3', 'Both');

-- Create FloodPredictions table
CREATE TABLE IF NOT EXISTS FloodPredictions (
    PredictionID INT AUTO_INCREMENT PRIMARY KEY,
    Location VARCHAR(100) NOT NULL,
    PredictionDate DATE NOT NULL,
    PredictionTime TIME NOT NULL,
    FloodIntensity ENUM('Low', 'Medium', 'High') NOT NULL
);

-- Insert sample data into FloodPredictions table
INSERT INTO FloodPredictions (Location, PredictionDate, PredictionTime, FloodIntensity) 
VALUES 
('Madaraka', '2024-06-03', '12:00:00', 'Low'),
('Westlands', '2024-06-03', '12:00:00', 'High'),
('Parklands', '2024-06-04', '09:00:00', 'Medium');

-- Create SensorsData table
CREATE TABLE IF NOT EXISTS SensorsData (
    DataID INT AUTO_INCREMENT PRIMARY KEY,
    Location VARCHAR(100) NOT NULL,
    TopographyDrainage FLOAT NOT NULL,
    MonsoonIntensity FLOAT NOT NULL,
    RiverManagement FLOAT NOT NULL,
    Urbanization FLOAT NOT NULL,
    Deforestation FLOAT NOT NULL,
    Siltation FLOAT NOT NULL,
    DrainageSystems FLOAT NOT NULL,
    Encroachments FLOAT NOT NULL
);

-- Insert sample data into SensorsData table
INSERT INTO SensorsData (Location, TopographyDrainage, MonsoonIntensity, RiverManagement, Urbanization, Deforestation, Siltation, DrainageSystems, Encroachments) 
VALUES 
('Madaraka', 0.5, 0.8, 0.6, 0.7, 0.4, 0.6, 0.7, 0.5),
('Westlands', 0.6, 0.7, 0.5, 0.6, 0.3, 0.5, 0.6, 0.4),
('Parklands', 0.4, 0.6, 0.4, 0.5, 0.2, 0.4, 0.5, 0.3);
