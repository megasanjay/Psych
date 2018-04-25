-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 25, 2018 at 06:30 AM
-- Server version: 5.6.38
-- PHP Version: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `psych`
--

-- --------------------------------------------------------

--
-- Table structure for table `crosscheck`
--

CREATE TABLE `crosscheck` (
  `recordnum` int(5) NOT NULL,
  `username` varchar(30) NOT NULL,
  `recordDate` varchar(30) NOT NULL,
  `patientName` varchar(50) NOT NULL,
  `patientAge` int(2) NOT NULL,
  `patientHeight` double(5,2) NOT NULL,
  `patientWeight` double(5,2) NOT NULL,
  `timestamp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `currenttask`
--

CREATE TABLE `currenttask` (
  `username` varchar(30) NOT NULL,
  `tasknum` int(2) NOT NULL,
  `refresh` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `currenttask`
--

INSERT INTO `currenttask` (`username`, `tasknum`, `refresh`) VALUES
('testuser1', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `financialInfo`
--

CREATE TABLE `financialInfo` (
  `recordnum` int(5) NOT NULL,
  `username` varchar(30) NOT NULL,
  `recorddate` varchar(30) NOT NULL,
  `checknumber` int(15) NOT NULL,
  `amount` double(30,2) NOT NULL,
  `timestamp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `id` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `goaltype` varchar(15) NOT NULL,
  `goalamount` int(4) NOT NULL,
  `goaltimer` double(20,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `labelappointmentinfo`
--

CREATE TABLE `labelappointmentinfo` (
  `id` int(5) NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `apptnum` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `labelappointmentinfo`
--

INSERT INTO `labelappointmentinfo` (`id`, `firstname`, `lastname`, `apptnum`) VALUES
(1, 'Sharyn', 'Lauck', 4),
(2, 'Garret', 'Urry', 2),
(3, 'Wayne', 'Georgeson', 3),
(4, 'Wayne', 'Trethewey', 5),
(5, 'Ozie', 'Langeness', 8),
(6, 'Donnell', 'Barbagelata', 6),
(7, 'Pamella', 'Ghamdi', 7);

-- --------------------------------------------------------

--
-- Table structure for table `labelappointmentinput`
--

CREATE TABLE `labelappointmentinput` (
  `id` int(5) NOT NULL,
  `username` varchar(30) NOT NULL,
  `position` int(5) NOT NULL,
  `selected` varchar(50) NOT NULL,
  `timestamp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `logininfo`
--

CREATE TABLE `logininfo` (
  `username` varchar(30) NOT NULL,
  `password` varchar(10) NOT NULL,
  `emailaddress` varchar(30) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `financial` int(2) NOT NULL,
  `memo` int(2) NOT NULL,
  `crosscheck` int(2) NOT NULL,
  `sortfiles` int(2) NOT NULL,
  `percentage` int(2) NOT NULL,
  `appointments` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `logininfo`
--

INSERT INTO `logininfo` (`username`, `password`, `emailaddress`, `admin`, `financial`, `memo`, `crosscheck`, `sortfiles`, `percentage`, `appointments`) VALUES
('robbyn', 'admin', 'robbyn@gmail.com', 1, 0, 0, 0, 0, 0, 0),
('testuser1', 'test', 'test@gmail.com', 0, 10, 3, 10, 10, 10, 10);

-- --------------------------------------------------------

--
-- Table structure for table `memoinfo`
--

CREATE TABLE `memoinfo` (
  `id` int(3) NOT NULL,
  `memotext` varchar(4000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `memoinfo`
--

INSERT INTO `memoinfo` (`id`, `memotext`) VALUES
(1, 'Be sure to check! your emails tod8y. A company wid announcement will be sent by our administration office. Have an awesum day.'),
(2, 'Remember 2 lock up all valuables when out on the floor. Phons are to be left in the break room If a phone si seen on the floor you will be written up.'),
(3, 'It’s the weekend! No important messages to day. Just take a break and have sum fun theis wekeend.'),
(4, 'If you arrive mor than 10 minutes early do not clock in! you are allowed to clokci in 10 mintes before your shift but no earlier.'),
(5, 'We will be performings eversal software updates on Friday May 9 th . Sevices may be temporarily unavailable from 12pm – 2 pm. Take the necessary precaustions.'),
(6, 'Thank you for all of your hard work. This memo is just to sya that we appreciate each end every 1 of you. Thank you for all you do eavery day!'),
(7, 'Remember to sign off on all appointments once compltd. This is of utmost importantce as it impacts oru billing services and ability to continue services;'),
(8, 'Please see our office manager 4 time off requests. The procedure fo r requesting time off has changed. And he will be happy to assit you with any questions or concerns.');

-- --------------------------------------------------------

--
-- Table structure for table `memoinput`
--

CREATE TABLE `memoinput` (
  `id` int(11) NOT NULL,
  `memoID` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `memotext` varchar(4000) NOT NULL,
  `timestamp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `memoinput`
--

INSERT INTO `memoinput` (`id`, `memoID`, `username`, `memotext`, `timestamp`) VALUES
(1, 1, 'testuser1', 'Be sure to check! your emails tod8y. A company wid announcement will be sent by our administration office. Have an awesum day.', '2018-04-24 23:27:42');

-- --------------------------------------------------------

--
-- Table structure for table `percentageinput`
--

CREATE TABLE `percentageinput` (
  `recordnum` int(5) NOT NULL,
  `username` varchar(30) NOT NULL,
  `apptattend` int(4) NOT NULL,
  `apptlate` int(4) NOT NULL,
  `apptnotattend` int(4) NOT NULL,
  `percentattend` double(7,4) DEFAULT NULL,
  `percentlate` double(7,4) DEFAULT NULL,
  `timestamp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `restrictions`
--

CREATE TABLE `restrictions` (
  `username` varchar(30) NOT NULL,
  `limiter` int(2) NOT NULL,
  `limited` int(2) NOT NULL,
  `day` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `restrictions`
--

INSERT INTO `restrictions` (`username`, `limiter`, `limited`, `day`) VALUES
('testuser1', 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sortedfiles`
--

CREATE TABLE `sortedfiles` (
  `recordnum` int(5) NOT NULL,
  `username` varchar(30) NOT NULL,
  `inputfile` varchar(15) NOT NULL,
  `selected` varchar(2) NOT NULL,
  `timestamp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `crosscheck`
--
ALTER TABLE `crosscheck`
  ADD PRIMARY KEY (`recordnum`,`username`);

--
-- Indexes for table `currenttask`
--
ALTER TABLE `currenttask`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `financialInfo`
--
ALTER TABLE `financialInfo`
  ADD PRIMARY KEY (`recordnum`,`username`);

--
-- Indexes for table `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `labelappointmentinfo`
--
ALTER TABLE `labelappointmentinfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `labelappointmentinput`
--
ALTER TABLE `labelappointmentinput`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logininfo`
--
ALTER TABLE `logininfo`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `memoinfo`
--
ALTER TABLE `memoinfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `memoinput`
--
ALTER TABLE `memoinput`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `percentageinput`
--
ALTER TABLE `percentageinput`
  ADD PRIMARY KEY (`recordnum`);

--
-- Indexes for table `restrictions`
--
ALTER TABLE `restrictions`
  ADD PRIMARY KEY (`username`,`limiter`,`limited`);

--
-- Indexes for table `sortedfiles`
--
ALTER TABLE `sortedfiles`
  ADD PRIMARY KEY (`recordnum`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `goals`
--
ALTER TABLE `goals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `labelappointmentinfo`
--
ALTER TABLE `labelappointmentinfo`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `labelappointmentinput`
--
ALTER TABLE `labelappointmentinput`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `memoinfo`
--
ALTER TABLE `memoinfo`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `memoinput`
--
ALTER TABLE `memoinput`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sortedfiles`
--
ALTER TABLE `sortedfiles`
  MODIFY `recordnum` int(5) NOT NULL AUTO_INCREMENT;
