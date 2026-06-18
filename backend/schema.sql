-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 12, 2026 at 02:17 AM
-- Server version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sanbong`
--

-- =====================================================
-- BẢNG DANH MỤC (CATEGORIES) - MỚI
-- =====================================================

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL UNIQUE,
  `description` text,
  `image_url` varchar(255),
  `icon` varchar(100),
  `status` enum('active','inactive') DEFAULT 'active',
  `display_order` int DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BẢNG USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('admin','owner','customer') DEFAULT 'customer',
  `status` tinyint DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BẢNG VENUES (ĐỊA ĐIỂM)
-- =====================================================

CREATE TABLE IF NOT EXISTS `venues` (
  `venue_id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int DEFAULT NULL,
  `venue_name` varchar(255) DEFAULT NULL,
  `description` text,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`venue_id`),
  KEY `owner_id` (`owner_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `venues_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BẢNG COURTS (SÂN BÓNG)
-- =====================================================

CREATE TABLE IF NOT EXISTS `courts` (
  `court_id` int NOT NULL AUTO_INCREMENT,
  `venue_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `court_name` varchar(100) NOT NULL,
  `sport_type` varchar(50) DEFAULT NULL,
  `description` text,
  `location` varchar(255),
  `price_per_hour` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT 10,
  `length` decimal(5,2),
  `width` decimal(5,2),
  `surface_type` enum('grass','synthetic','concrete','wooden') DEFAULT 'grass',
  `amenities` json,
  `phone_number` varchar(20),
  `operating_hours_start` time,
  `operating_hours_end` time,
  `is_available` boolean DEFAULT true,
  `rating` decimal(3,2) DEFAULT 0,
  `total_reviews` int DEFAULT 0,
  `view_count` int DEFAULT 0,
  `status` enum('active','inactive','maintenance') DEFAULT 'active',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`court_id`),
  KEY `venue_id` (`venue_id`),
  KEY `category_id` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category_id`),
  KEY `idx_price` (`price_per_hour`),
  CONSTRAINT `courts_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`venue_id`) ON DELETE CASCADE,
  CONSTRAINT `courts_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BẢNG HÌNH ẢNH SÂN
-- =====================================================

CREATE TABLE IF NOT EXISTS `court_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `court_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `court_id` (`court_id`),
  CONSTRAINT `court_images_ibfk_1` FOREIGN KEY (`court_id`) REFERENCES `courts` (`court_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BẢNG LỊCH ĐẶT (BOOKINGS)
-- =====================================================

CREATE TABLE IF NOT EXISTS `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `court_id` int DEFAULT NULL,
  `booking_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `total_hours` decimal(5,2),
  `price_per_hour` decimal(10,2),
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `notes` text,
  `payment_status` enum('unpaid','paid','refunded') DEFAULT 'unpaid',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `court_id` (`court_id`),
  KEY `idx_booking_date` (`booking_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`court_id`) REFERENCES `courts` (`court_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BẢNG ĐÁNH GIÁ (REVIEWS)
-- =====================================================

CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `court_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`),
  KEY `court_id` (`court_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`court_id`) REFERENCES `courts` (`court_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BẢNG THANH TOÁN (PAYMENTS)
-- =====================================================

CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_code` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','paid','failed') DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `booking_id` (`booking_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- BẢNG THÔNG BÁO (NOTIFICATIONS)
-- =====================================================

CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text,
  `is_read` tinyint DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- DỮ LIỆU MẪU - DANH MỤC (Bóng rổ)
-- =====================================================

INSERT INTO `categories` (`name`, `description`, `icon`, `status`, `display_order`) VALUES
('Sân 3x3', 'Sân bóng rổ nửa sân', '🏀', 'active', 1),
('Sân 5x5', 'Sân bóng rổ tiêu chuẩn', '🏀', 'active', 2),
('Sân trong nhà', 'Có mái che, điều hòa', '🏢', 'active', 3),
('Sân ngoài trời', 'Sân mở ngoài trời', '☀️', 'active', 4),
('Sân thi đấu', 'Đạt tiêu chuẩn tổ chức giải', '🏆', 'active', 5),
('Sân tập luyện', 'Dành cho tập cá nhân, đội nhóm', '💪', 'active', 6);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
