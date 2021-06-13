-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: zavrsni_dev
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (33,''),(34,''),(35,''),(36,''),(37,''),(38,''),(39,''),(40,'');
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats_users`
--

DROP TABLE IF EXISTS `chats_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats_users` (
  `chat_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `updated_at` timestamp NOT NULL,
  KEY `fk_chats_has_users_users1_idx` (`user_id`),
  KEY `fk_chats_has_users_chats1_idx` (`chat_id`),
  CONSTRAINT `fk_chats_has_users_chats1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chats_has_users_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats_users`
--

LOCK TABLES `chats_users` WRITE;
/*!40000 ALTER TABLE `chats_users` DISABLE KEYS */;
INSERT INTO `chats_users` VALUES (39,1,'2021-01-21 14:43:07'),(39,2,'2021-01-21 14:43:07'),(40,1,'2021-01-24 11:35:15'),(40,3,'2021-01-21 14:46:53'),(33,3,'2021-01-24 11:26:39'),(33,2,'2021-01-24 11:26:41');
/*!40000 ALTER TABLE `chats_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `user1_id` int unsigned NOT NULL,
  `user2_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL,
  UNIQUE KEY `users_user1_id_user2_id_ui_idx` (`user1_id`,`user2_id`),
  KEY `fk_users_friends_users1_idx` (`user1_id`),
  KEY `fk_users_friends_users2_idx` (`user2_id`),
  CONSTRAINT `fk_users_friends_users1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_users_friends_users2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (1,2,'2021-01-26 21:52:50'),(1,4,'2021-01-24 17:01:19'),(2,1,'2021-01-26 21:52:50'),(4,1,'2021-01-24 17:01:19');
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `chat_id` int unsigned NOT NULL,
  `sender_id` int unsigned NOT NULL,
  `body` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_messages_chats1_idx` (`chat_id`),
  CONSTRAINT `fk_messages_chats1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=407 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (394,39,1,'hi','2021-01-21 14:43:07'),(395,39,1,'hi','2021-01-21 14:43:10'),(396,39,1,'hi','2021-01-21 14:43:12'),(397,39,1,'hi','2021-01-21 14:43:13'),(398,40,1,'hi','2021-01-21 14:46:53'),(399,40,1,'hi','2021-01-21 14:46:56'),(401,40,1,'hi','2021-01-21 14:46:57'),(402,39,2,'hi','2021-01-21 14:46:59'),(403,39,1,'hi','2021-01-21 14:47:00'),(404,39,1,'hi','2021-01-21 14:47:00'),(405,39,1,'hi','2021-01-21 14:47:01'),(406,33,2,'sa','2021-01-21 14:47:01');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_friends`
--

DROP TABLE IF EXISTS `pending_friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_friends` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_outgoing_id` int unsigned NOT NULL,
  `user_incoming_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pending_friend_requests_ui_idx` (`user_incoming_id`,`user_outgoing_id`),
  KEY `fk_pending_friend_requests_users1_idx` (`user_incoming_id`),
  KEY `fk_pending_friend_requests_users2_idx` (`user_outgoing_id`),
  CONSTRAINT `fk_pending_friend_requests_users1` FOREIGN KEY (`user_incoming_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_pending_friend_requests_users2` FOREIGN KEY (`user_outgoing_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_friends`
--

LOCK TABLES `pending_friends` WRITE;
/*!40000 ALTER TABLE `pending_friends` DISABLE KEYS */;
INSERT INTO `pending_friends` VALUES (2,3,2,'2021-01-24 15:48:54'),(10,1,4,'2021-01-24 17:01:44');
/*!40000 ALTER TABLE `pending_friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `post_id` int unsigned DEFAULT NULL,
  `body` text,
  `image_path` varchar(255) DEFAULT NULL,
  `num_comments` int unsigned NOT NULL DEFAULT '0',
  `num_likes` int unsigned NOT NULL DEFAULT '0',
  `private` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_post_user1_idx` (`user_id`),
  KEY `fk_posts_posts1_idx` (`post_id`),
  CONSTRAINT `fk_post_user1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_posts_posts1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (80,2,NULL,'this is user id 2',NULL,0,0,0,'2021-01-08 07:50:16','2021-01-08 07:50:16'),(81,3,NULL,'this is user id 3',NULL,0,0,0,'2021-01-08 07:50:26','2021-01-08 07:50:26'),(83,2,NULL,'another post','main.jpg',0,0,0,'2021-01-08 08:32:31','2021-01-26 21:00:50'),(111,2,83,'',NULL,0,0,0,'2021-01-09 12:41:28','2021-01-09 12:41:28'),(204,1,NULL,'test','main.jpg',0,0,1,'2021-01-17 17:46:51','2021-01-17 17:46:51'),(206,1,NULL,'test',NULL,1,0,0,'2021-01-24 17:54:31','2021-01-25 10:32:44'),(209,1,NULL,'testing posting',NULL,6,0,0,'2021-01-25 09:42:03','2021-01-25 10:31:32'),(210,1,209,'replying',NULL,0,0,0,'2021-01-25 09:45:43','2021-01-25 09:45:43'),(211,1,209,'hey new comment',NULL,0,0,0,'2021-01-25 09:57:24','2021-01-25 09:57:24'),(212,1,209,'ok now it works',NULL,0,0,0,'2021-01-25 09:57:54','2021-01-25 09:57:54'),(213,1,209,'testing multiple replies',NULL,0,0,0,'2021-01-25 09:58:00','2021-01-25 09:58:00'),(219,1,209,'sadsadasdasdas',NULL,0,0,0,'2021-01-25 10:31:29','2021-01-25 10:31:29'),(220,1,209,'dsadsadsadasdasdsa',NULL,0,0,0,'2021-01-25 10:31:32','2021-01-25 10:31:32'),(221,1,206,'test',NULL,0,0,0,'2021-01-25 10:32:44','2021-01-25 10:32:44'),(222,1,NULL,'test','main.jpg',0,0,0,'2021-01-26 15:24:02','2021-01-26 15:24:02'),(226,1,NULL,'test image','meals.jpg',0,0,0,'2021-01-26 15:30:58','2021-01-26 15:30:58'),(228,1,NULL,'ZAHTJEVI!!!!','ZahtjeviProjekata2021_001.bmp',1,0,0,'2021-01-26 15:33:07','2021-02-08 10:19:04'),(239,1,228,'s',NULL,0,0,0,'2021-02-08 10:19:04','2021-02-08 10:19:04');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `bio` text,
  `location` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `relationship_status` varchar(20) DEFAULT NULL,
  `website` varchar(50) DEFAULT NULL,
  `image_path` varchar(45) DEFAULT NULL,
  `username` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ante','Antic','Hey this is all about me!','Zagreb, Croatia','0916969420','Male','Single :(','www.ante.com','img/profile_photo.png','ante','ante@ante.com','$2b$10$yb40j/joo./h/Yz8wuEIauSSBd1pRoLX7gJEYsVrRtKAkeTiwCUBu','2021-01-01'),(2,'Ivan','Horvat','mHdfsI','Trg bana Jelacica','0926556512',NULL,NULL,NULL,'img/profile_photo.png','root','root','$2b$10$Vgok2cdEyPyfNAXgu3.N6uc5zz5NCBUITtbLKcrs6qzUJSjOopT7C','2021-01-01'),(3,'Marko','Markic',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'user.Name','user','$2b$10$GN8CR9t2u9OETkwlnDSLBe0c3WH.J0kN1TpE08QT80m7D/u5CxH/S','2021-01-01'),(4,'Novi','Prezime',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'noviUser','novi','$2b$10$GN8CR9t2u9OETkwlnDSLBe0c3WH.J0kN1TpE08QT80m7D/u5CxH/S','2021-01-01'),(5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tgestes','fehdsujafhdsku','$2b$10$12nrPVqDjKk9Qhhb9UpFpuiKHFcISU72leIXUeGd5uXsHpXGyA/l.','2021-01-21'),(50,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'antef','antfe','ante','2021-01-21'),(73,'test','test',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Antete','antete@antete.com','$2b$10$pD9XnWO5L4PZ/j99dFs4VOKgwgn52H8MpFRisJ2c2VR.zuiBm7rP2','2021-01-26'),(75,'test','test',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Antetesad','antete@antedsate.com','$2b$10$BBaENwYhfJ9HXk0hkSmJJOEE3Ag9XXuS6TBbDzUJQi.VebSQqMrdS','2021-01-26'),(76,'ffdsafd1fsda@ante.com','ffdsafd1fsda@ante.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'fdsdfsafds','ffdsafd1fsda@ante.com','$2b$10$yGO02cbCg7Gb6APWhTlXKeZEp4k237.irujvNWigaxzwd.MT/vHRK','2021-01-26'),(77,'ffdsafd1fsda@ante.com','ffdsafd1fsda@ante.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ffdsafd1fsda@ante.com','ffdsafdssda@ante.com','$2b$10$BsMcFNIN1t67TMnSAmwTAuBp8.3.KuDSFxprkFJni9p07je2vWKjq','2021-01-26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_posts_likes`
--

DROP TABLE IF EXISTS `users_posts_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_posts_likes` (
  `post_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  UNIQUE KEY `users_posts_likes_ui_idx` (`post_id`,`user_id`),
  KEY `fk_users_posts_likes_users1_idx` (`user_id`),
  KEY `fk_users_posts_likes_posts1_idx` (`post_id`),
  CONSTRAINT `fk_users_posts_likes_posts1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_users_posts_likes_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_posts_likes`
--

LOCK TABLES `users_posts_likes` WRITE;
/*!40000 ALTER TABLE `users_posts_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_posts_likes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-15  9:53:02
