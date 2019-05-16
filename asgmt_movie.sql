-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2019 at 09:00 AM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `asgmt_movie`
--

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `comment_id` int(11) NOT NULL,
  `comment_user_id` int(11) NOT NULL,
  `comment_video_id` int(11) NOT NULL,
  `comment_post_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_is_active` tinyint(1) NOT NULL DEFAULT '1',
  `comment_detail` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`comment_id`, `comment_user_id`, `comment_video_id`, `comment_post_time`, `comment_is_active`, `comment_detail`) VALUES
(1, 3, 2, '2019-05-15 06:34:13', 1, 'Phim hay quá!'),
(2, 3, 1, '2019-05-15 06:36:18', 1, 'Phim hay quá!'),
(3, 4, 1, '2019-05-15 06:37:00', 1, 'Một bộ phim tuyệt vời!'),
(4, 3, 2, '2019-05-15 06:37:17', 1, 'Thích phim này ghê!'),
(5, 5, 2, '2019-05-15 06:37:44', 1, 'Xem hoài không chán'),
(6, 5, 3, '2019-05-15 06:38:11', 1, 'Phim xúc động quá, thật tuyệt vời!'),
(7, 3, 3, '2019-05-15 06:38:36', 1, 'Xem cũng tạm, khá hay!'),
(8, 4, 4, '2019-05-15 06:38:54', 1, 'Kết thúc có hậu '),
(9, 5, 4, '2019-05-15 06:39:16', 1, 'Nhất định sẽ xem lại nhiều lần nữa!'),
(10, 3, 5, '2019-05-15 06:39:44', 1, 'Hoạt hình Disney không chê vào đâu được'),
(11, 5, 5, '2019-05-15 06:40:05', 1, 'Phim xứng đáng đoạt giải Oscar!');

-- --------------------------------------------------------

--
-- Table structure for table `series`
--

CREATE TABLE `series` (
  `series_id` int(11) NOT NULL,
  `series_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `series_uploader_id` int(11) DEFAULT NULL,
  `series_created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_series` tinyint(1) NOT NULL DEFAULT '0',
  `series_expected_ep_count` int(11) DEFAULT NULL,
  `series_rating` int(11) DEFAULT NULL,
  `series_description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `series_year` int(11) DEFAULT NULL,
  `series_tags` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `series_is_active` tinyint(1) NOT NULL DEFAULT '1',
  `series_thumbnail` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `series`
--

INSERT INTO `series` (`series_id`, `series_name`, `series_uploader_id`, `series_created_date`, `is_series`, `series_expected_ep_count`, `series_rating`, `series_description`, `series_year`, `series_tags`, `series_is_active`, `series_thumbnail`) VALUES
(1, 'Grey\'s Anatomy', 2, '2019-05-13 03:25:55', 1, 24, 7, 'In this season, challenges keep coming. Loyalties will be tested, relationships will be strained and everyone’s future will hang in the balance.But no matter how hard life is, the doctors of Seattle Grace know they can always lean on one another.', 2011, '[\"Drama\", \"Romance\"]', 1, 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png'),
(2, 'The Princess and the Frog', 2, '2019-05-15 06:24:55', 0, 1, 7, 'A waitress, desperate to fulfill her dreams as a restaurant owner, is set on a journey to turn a frog prince back into a human being, but she has to face the same problem after she kisses him.', 2009, '[\"Cartoon\", \"Romance\"]', 1, 'https://images-na.ssl-images-amazon.com/images/I/61iJbHj4v-L._SY355_.jpg'),
(3, 'Beauty and the Beast', 2, '2019-05-15 06:28:33', 0, 1, 8, 'A prince cursed to spend his days as a hideous monster sets out to regain his humanity by earning a young woman\'s love.', 1991, '[\"Romance\", \"Cartoon\"]', 1, 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png'),
(4, 'Tangled', 2, '2019-05-15 06:31:15', 0, 1, 8, 'The magically long-haired Rapunzel has spent her entire life in a tower, but now that a runaway thief has stumbled upon her, she is about to discover the world for the first time, and who she really is.', 2010, '[\"Cartoon\"]', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Tangled_Ever_After_poster.jpg/220px-Tangled_Ever_After_poster.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `password` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `user_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `user_email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `user_type` enum('user','admin','root_admin') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'user',
  `user_joining_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_profile_image` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'https://avatars.servers.getgo.com/2205256774854474505_medium.jpg',
  `user_is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `password`, `user_name`, `user_email`, `user_type`, `user_joining_date`, `user_last_login`, `user_profile_image`, `user_is_active`) VALUES
(1, '123456', 'ROOT', 'root@admin.com', 'root_admin', '2019-05-11 07:42:03', '2019-05-11 07:42:03', 'https://avatars.servers.getgo.com/2205256774854474505_medium.jpg', 1),
(2, '123456', 'Nguyễn Hoàng Lộc', 'locnh@gmail.com', 'admin', '2019-05-11 07:52:40', '2019-05-11 07:52:40', 'https://avatars.servers.getgo.com/2205256774854474505_medium.jpg', 1),
(3, '123456', 'Nguyễn Hữu Anh Tiến', 'nghuuanhtien@gmail.com', 'user', '2019-05-11 07:53:19', '2019-05-11 07:53:19', 'https://avatars.servers.getgo.com/2205256774854474505_medium.jpg', 1),
(4, '123456', 'Văn Minh Hào', 'haovm@gmail.com', 'user', '2019-05-11 07:54:08', '2019-05-11 07:54:08', 'https://avatars.servers.getgo.com/2205256774854474505_medium.jpg', 1),
(5, '123456', 'Nguyễn Thị Thanh Huyền', 'thanhnv@gmail.com', 'user', '2019-05-11 07:54:37', '2019-05-11 07:54:37', 'https://avatars.servers.getgo.com/2205256774854474505_medium.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `video_id` int(11) NOT NULL,
  `video_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `video_series_id` int(11) NOT NULL,
  `video_thumbnail` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `video_source` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png',
  `video_uploader_id` int(11) DEFAULT NULL,
  `video_upload_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `video_episode` int(11) NOT NULL DEFAULT '1',
  `video_is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `video`
--

INSERT INTO `video` (`video_id`, `video_name`, `video_series_id`, `video_thumbnail`, `video_source`, `video_uploader_id`, `video_upload_time`, `video_episode`, `video_is_active`) VALUES
(1, 'Free Falling', 1, 'https://cdn.watch-series.co//greys-anatomy-season-8-vbu/cover.png', 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png', 2, '2019-05-13 03:27:59', 1, 1),
(2, 'She\'s gone', 1, 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png', 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png', 2, '2019-05-13 04:50:41', 2, 1),
(3, 'The Princess and the Frog', 2, 'https://images-na.ssl-images-amazon.com/images/I/61iJbHj4v-L._SY355_.jpg', 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png', 2, '2019-05-15 06:27:14', 1, 1),
(4, 'Beauty and the Beast', 3, 'https://images-na.ssl-images-amazon.com/images/I/61nHbiLZdLL._SY355_.jpg', 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png', 2, '2019-05-15 06:29:14', 1, 1),
(5, 'Tangled', 4, 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Tangled_Ever_After_poster.jpg/220px-Tangled_Ever_After_poster.jpg', 'https://www.cmo.com/content/dam/CMO_Other/articles/1046x616-video.png', 2, '2019-05-15 06:31:46', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `comment_user` (`comment_user_id`),
  ADD KEY `comment_video` (`comment_video_id`);

--
-- Indexes for table `series`
--
ALTER TABLE `series`
  ADD PRIMARY KEY (`series_id`),
  ADD KEY `series_user` (`series_uploader_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`user_email`);

--
-- Indexes for table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`video_id`),
  ADD KEY `video_series` (`video_series_id`),
  ADD KEY `video_user` (`video_uploader_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `series`
--
ALTER TABLE `series`
  MODIFY `series_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `video_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_user` FOREIGN KEY (`comment_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_video` FOREIGN KEY (`comment_video_id`) REFERENCES `video` (`video_id`);

--
-- Constraints for table `series`
--
ALTER TABLE `series`
  ADD CONSTRAINT `series_user` FOREIGN KEY (`series_uploader_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `video`
--
ALTER TABLE `video`
  ADD CONSTRAINT `video_series` FOREIGN KEY (`video_series_id`) REFERENCES `series` (`series_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `video_user` FOREIGN KEY (`video_uploader_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
