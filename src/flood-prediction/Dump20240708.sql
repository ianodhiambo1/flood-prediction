CREATE DATABASE  IF NOT EXISTS `flood` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `flood`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: flood
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `NotificationID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `PredictionID` int DEFAULT NULL,
  `SentTime` datetime NOT NULL,
  `Method` enum('Email','SMS') NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`NotificationID`),
  KEY `UserID` (`UserID`),
  KEY `PredictionID` (`PredictionID`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`PredictionID`) REFERENCES `predictions` (`PredictionID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100005 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `predictions`
--

DROP TABLE IF EXISTS `predictions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `predictions` (
  `PredictionID` int NOT NULL AUTO_INCREMENT,
  `Location` varchar(100) DEFAULT NULL,
  `PredictionTime` datetime NOT NULL,
  `FloodProbability` float NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `FloodType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PredictionID`)
) ENGINE=InnoDB AUTO_INCREMENT=1000079 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `predictions`
--

LOCK TABLES `predictions` WRITE;
/*!40000 ALTER TABLE `predictions` DISABLE KEYS */;
INSERT INTO `predictions` VALUES (100004,'Madaraka','2024-06-01 12:00:00',0.65,'2024-07-05 09:54:07','River Flood'),(100005,'Westlands','2024-06-02 09:30:00',0.8,'2024-07-05 09:54:07','Coastal Flood'),(100006,'Parklands','2024-06-03 14:45:00',0.7,'2024-07-05 09:54:07','Urban Flood'),(100007,'Nairobi','2024-06-04 11:15:00',0.6,'2024-07-05 09:54:07','Flash Flood'),(100008,'Madaraka','2024-06-05 10:00:00',0.85,'2024-07-05 09:54:07','River Flood'),(100009,'Westlands','2024-06-06 16:00:00',0.55,'2024-07-05 09:54:07','Coastal Flood'),(100010,'Parklands','2024-06-07 07:30:00',0.9,'2024-07-05 09:54:07','Urban Flood'),(100011,'Nairobi','2024-06-08 13:20:00',0.5,'2024-07-05 09:54:07','Flash Flood'),(100012,'Madaraka','2024-06-09 18:40:00',0.95,'2024-07-05 09:54:07','River Flood'),(1000078,'Nairobi','2024-05-30 08:15:00',0.75,'2024-07-05 09:54:07','Flash Flood');
/*!40000 ALTER TABLE `predictions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensordata`
--

DROP TABLE IF EXISTS `sensordata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensordata` (
  `SensorDataID` int NOT NULL AUTO_INCREMENT,
  `Location` varchar(100) DEFAULT NULL,
  `Timestamp` datetime NOT NULL,
  `TopographyDrainage` float NOT NULL,
  `MonsoonIntensity` float NOT NULL,
  `RiverManagement` float NOT NULL,
  `Urbanization` float NOT NULL,
  `Deforestation` float NOT NULL,
  `Siltation` float NOT NULL,
  `DrainageSystems` float NOT NULL,
  `Encroachments` float NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SensorDataID`)
) ENGINE=InnoDB AUTO_INCREMENT=100003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensordata`
--

LOCK TABLES `sensordata` WRITE;
/*!40000 ALTER TABLE `sensordata` DISABLE KEYS */;
INSERT INTO `sensordata` VALUES (100002,'Nairobi','2024-05-30 08:00:00',0.8,0.9,0.6,0.7,0.5,0.4,0.7,0.3,'2024-06-02 18:04:07');
/*!40000 ALTER TABLE `sensordata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Location` varchar(100) DEFAULT NULL,
  `NotificationPreference` enum('Email','SMS','Both') NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=100006 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (100003,'JohnDoe33','distro890@myself.com','0707798705','Parklands','Email','2024-06-03 20:09:08','$2b$10$CsKc1o7S/S.nhDdY/AiuYelYfuP9AW57HXWYa9udbMFb1p6/UO2gS'),(100004,'JohnLous','johnlous@gmail.com','0712456789','Parklands','Email','2024-06-17 08:02:05','$2b$10$E.zDDJtp7hBCN4aUuHQcruuvQAsp.XqCpjHAMT4WFwRW8AR1nyQDO'),(100005,'David','ian.odhiambo@strathmore.edu','0707798705','Madaraka','Both','2024-07-02 21:57:00','$2b$10$CEi6dwgEshL4GyZ5q.Q./OeGceOdnqrHbdBHh11yhtgaPKrR1GWcS');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-08 22:23:49
