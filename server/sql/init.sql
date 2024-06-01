-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               10.4.32-MariaDB - mariadb.org binary distribution
-- Операционная система:         Win64
-- HeidiSQL Версия:              12.7.0.6850
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Дамп структуры базы данных mobil_operator
CREATE DATABASE IF NOT EXISTS `mobil_operator` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `mobil_operator`;

-- Дамп структуры для таблица mobil_operator.calls
CREATE TABLE IF NOT EXISTS `calls` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `to_phone_number` int(15) unsigned NOT NULL,
  `call_start_time` datetime NOT NULL,
  `call_end_time` datetime NOT NULL,
  `call_duration` int(10) unsigned NOT NULL,
  `phone_number_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `calls_phone_number_id_phone_numbers_id_fk` (`phone_number_id`),
  CONSTRAINT `calls_phone_number_id_phone_numbers_id_fk` FOREIGN KEY (`phone_number_id`) REFERENCES `phone_numbers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица mobil_operator.customers
CREATE TABLE IF NOT EXISTS `customers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `fullname` varchar(120) NOT NULL,
  `birthday` date NOT NULL,
  `passport` int(10) unsigned NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `snils` int(11) unsigned NOT NULL,
  `inn` int(12) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица mobil_operator.options
CREATE TABLE IF NOT EXISTS `options` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица mobil_operator.phone_numbers
CREATE TABLE IF NOT EXISTS `phone_numbers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `phone_number` int(15) unsigned NOT NULL,
  `customer_id` bigint(20) unsigned NOT NULL,
  `tariff_id` bigint(20) unsigned NOT NULL,
  `startdate` date NOT NULL,
  `enddate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `phone_numbers_tariff_id_tariffs_id_fk` (`tariff_id`),
  KEY `phone_numbers_customer_id_customers_id_fk` (`customer_id`),
  CONSTRAINT `phone_numbers_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `phone_numbers_tariff_id_tariffs_id_fk` FOREIGN KEY (`tariff_id`) REFERENCES `tariffs` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица mobil_operator.tariffs
CREATE TABLE IF NOT EXISTS `tariffs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `monthly_fee` int(10) unsigned NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица mobil_operator.tariff_options
CREATE TABLE IF NOT EXISTS `tariff_options` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tariff_id` bigint(20) unsigned NOT NULL,
  `option_id` bigint(20) unsigned NOT NULL,
  `value` int(10) unsigned NOT NULL,
  `unit` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tariff_options_tariff_id_tariffs_id_fk` (`tariff_id`),
  KEY `tariff_options_tariff_id_options_id_fk` (`option_id`),
  CONSTRAINT `tariff_options_tariff_id_options_id_fk` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `tariff_options_tariff_id_tariffs_id_fk` FOREIGN KEY (`tariff_id`) REFERENCES `tariffs` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Экспортируемые данные не выделены.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
