-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2025 at 04:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aiplacement`
--

-- --------------------------------------------------------

--
-- Table structure for table `aptitude`
--

CREATE TABLE `aptitude` (
  `q_no` bigint(20) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `correct_ans_no` int(11) DEFAULT NULL,
  `option_1` varchar(255) DEFAULT NULL,
  `option_2` varchar(255) DEFAULT NULL,
  `option_3` varchar(255) DEFAULT NULL,
  `option_4` varchar(255) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `difficulty` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aptitude`
--

INSERT INTO `aptitude` (`q_no`, `category`, `correct_ans_no`, `option_1`, `option_2`, `option_3`, `option_4`, `question`, `difficulty`) VALUES
(4, 'Distance and Speed', 1, 'A. 5 sec', 'B. 7 sec', 'C. 8 sec', 'D. 9 sec', 'A train 200 meters long is running at a speed of 72 km/h. How long will it take to pass a pole?', NULL),
(6, 'Work and Time', 1, '7.2 days', '6.5 days', ' 10 days', '8 days', 'A alone can complete a work in 12 days, and B in 18 days. Working together, how many days to complete the work?', NULL),
(7, 'Work and Time', 1, '60 days', '15 days', '25 days', '20 days', 'A, B, and C can do a work in 10 days. A alone: 20 days, B alone: 30 days. C alone?', NULL),
(8, 'Work and Time', 2, '60 mins', 'Never (Tank won\'t fill)', '30 mins', '90 mins', 'Two pipes fill a tank in 20 and 30 minutes. Third pipe empties in 15 min. All open, time to fill?', NULL),
(9, 'Work and Time', 3, '20 days', ' 25 days', '24 days', ' 28 days', ' 20 workers, 40 days. After 10 days, workers become 30. How many more days needed?', NULL),
(10, 'Work and Time', 2, '32 days', '48 days', '36 days', '24 days', 'Man and son: 16 days. Man is twice as efficient. Son alone?', NULL),
(11, 'Work and Time', 3, '5 days', '6 days', ' 4.5 days', ' 7 days', 'A: 15 days, B: 10 days, C: 30 days. All start, A leaves after 3 days. Days left for B & C?', NULL),
(12, 'Percentage', 2, '20%', '25%', '30%', '35%', 'A man buys a chair for ₹500 and sells it for ₹650. What is the profit percentage?', NULL),
(13, 'Number series', 3, '36', '40', '42', '44', 'What comes next in the series: 2, 6, 12, 20, 30, ?', NULL),
(14, 'Number series', 2, '29', '31', '33', '35', 'The average of 5 consecutive odd numbers is 35. What is the smallest number?', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `fid` bigint(20) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`fid`, `department`, `email_id`, `name`) VALUES
(3, 'CSE', 'xyz.gmail.com', 'Swati mam'),
(4, 'CSE', 'xyz12.gmail.com', 'Ajay');

-- --------------------------------------------------------

--
-- Table structure for table `performancematrix`
--

CREATE TABLE `performancematrix` (
  `id` bigint(20) NOT NULL,
  `attempt_no` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `sub_name` varchar(255) DEFAULT NULL,
  `usn` varchar(255) DEFAULT NULL,
  `quiz_date` datetime(6) DEFAULT NULL,
  `timetaken` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `performancematrix`
--

INSERT INTO `performancematrix` (`id`, `attempt_no`, `score`, `sub_name`, `usn`, `quiz_date`, `timetaken`) VALUES
(450, 1, 0, 'Apti', '2mm22cs065', '2025-04-30 01:10:00.000000', '28'),
(453, 2, 0, 'Apti', '2mm22cs065', '2025-04-30 18:02:44.000000', '22'),
(454, 1, 0, 'CN', '2mm22cs065', '2025-04-30 18:02:57.000000', NULL),
(455, 1, 0, 'OS', '2mm22cs065', '2025-04-30 18:03:06.000000', NULL),
(456, 1, 0, 'DB', '2mm22cs065', '2025-04-30 18:03:14.000000', NULL),
(457, 1, 0, 'DSA', '2mm22cs065', '2025-04-30 18:03:20.000000', NULL),
(458, 1, 0, 'OOPS', '2mm22cs065', '2025-04-30 18:03:26.000000', NULL),
(459, 1, 0, 'SE', '2mm22cs065', '2025-04-30 18:03:31.000000', NULL),
(463, 1, 0, 'Program-Skill', '2mm22cs065', '2025-04-30 18:39:43.000000', '0m 21s'),
(464, 3, 0, 'Apti', '2mm22cs065', '2025-04-30 18:58:39.000000', '805');

-- --------------------------------------------------------

--
-- Table structure for table `program_skill`
--

CREATE TABLE `program_skill` (
  `q_no` bigint(20) NOT NULL,
  `correct_ans_no` int(11) DEFAULT NULL,
  `option_1` varchar(255) DEFAULT NULL,
  `option_2` varchar(255) DEFAULT NULL,
  `option_3` varchar(255) DEFAULT NULL,
  `option_4` varchar(255) DEFAULT NULL,
  `problem_statement` varchar(255) DEFAULT NULL,
  `sub_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_skill`
--

INSERT INTO `program_skill` (`q_no`, `correct_ans_no`, `option_1`, `option_2`, `option_3`, `option_4`, `problem_statement`, `sub_name`) VALUES
(4, 1, '8 ', '6 ', '4 ', '10 ', 'What is the output of 2 + 2 * 2 in Python?', 'Python'),
(6, 1, '5', '6', 'error', 'undefined', 'int a = 5;\r\nprintf(\"%d\", a++);\r\n', 'c-programming');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` bigint(20) NOT NULL,
  `branch` varchar(255) DEFAULT NULL,
  `sem` int(11) DEFAULT NULL,
  `stdname` varchar(255) DEFAULT NULL,
  `usn` varchar(255) DEFAULT NULL,
  `be1score` float DEFAULT NULL,
  `be2score` float DEFAULT NULL,
  `be3score` float DEFAULT NULL,
  `pucscore` float DEFAULT NULL,
  `sslcscore` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `branch`, `sem`, `stdname`, `usn`, `be1score`, `be2score`, `be3score`, `pucscore`, `sslcscore`) VALUES
(1, 'CSE', 6, 'Shreyash', '2mm22cs065', 80, 81, 79, 73, 82),
(2, 'CSE', 6, 'Pranav', '2mm22cs064', NULL, NULL, NULL, NULL, NULL),
(3, 'CS', 6, 'anirudh', '2mm22cs066', NULL, NULL, NULL, NULL, NULL),
(4, 'CS', 6, 'fv4eved', 'frev4gf', NULL, NULL, NULL, NULL, NULL),
(5, 'ECE', 6, 'Vikas', '2mm22ec001', NULL, NULL, NULL, NULL, NULL),
(6, 'CSE', 4, 'Vinay', '2mm22cs002', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `technical_subject_skill`
--

CREATE TABLE `technical_subject_skill` (
  `q_no` bigint(20) NOT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `correct_ans` int(11) DEFAULT NULL,
  `option_1` varchar(255) DEFAULT NULL,
  `option_2` varchar(255) DEFAULT NULL,
  `option_3` varchar(255) DEFAULT NULL,
  `option_4` varchar(255) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `sub_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_subject_skill`
--

INSERT INTO `technical_subject_skill` (`q_no`, `branch_name`, `correct_ans`, `option_1`, `option_2`, `option_3`, `option_4`, `question`, `sub_name`) VALUES
(4, 'CSE', 1, 'A. SELECT DISTINCT column_name FROM table_name; ', 'B. SELECT UNIQUE column_name FROM table_name; ', 'C. SELECT DIFFERENT column_name FROM table_name; ', 'D. SELECT DISTINCTIVE column_name FROM table_name; ', 'Which SQL statement is used to retrieve unique records from a table?', 'DB'),
(5, 'CSE', 2, 'Data Link Layer', 'Transport Layer', 'Network Layer', 'Application Layer', 'Which layer of the OSI model is responsible for end-to-end communication and error recovery?\r\n\r\n', 'CN'),
(6, 'CSE', 1, 'All entities are related to some entity in the other set', 'Some entities may not be related', 'One entity can relate to many entities', 'Every entity must be a weak entity', 'In an ER model, total participation of an entity in a relationship implies:', 'DB'),
(7, 'CSE', 3, 'It has a primary key of its own', 'It does not participate in any relationship', 'It must be part of a total participation relationship', 'It can exist without a strong entity', 'Which of the following is true for a weak entity?', 'DB'),
(8, 'CSE', 1, 'The process of moving from higher-level entities to lower-level entities', 'Used to combine multiple entities into one', 'The same as generalization', 'Only used for weak entities', 'In ER modeling, specialization is:', 'DB'),
(9, 'CSE', 3, 'Strong entity', 'Weak entity', 'Multivalued entity', 'Associative entity', 'Which of the following is NOT a type of entity set in ER modeling?', 'DB'),
(10, 'CSE', 3, 'Attribute', 'Entity', 'Relationship', 'Weak entity', 'In ER diagrams, a diamond symbol represents:', 'DB'),
(11, 'CSE', 3, 'A foreign key uniquely identifies each record in a table', 'A foreign key is not needed if primary keys are defined', 'A foreign key establishes a relationship between two tables', 'A foreign key cannot reference the same table', 'Which of the following statements about foreign keys is true?', 'DB'),
(12, 'CSE', 3, 'Primary key', 'Candidate key', 'Foreign key', 'Super key', 'Which of the following is used to ensure referential integrity in relational databases?', 'DB'),
(13, 'CSE', 1, 'It is in 2NF and has no transitive dependencies', 'It is in 1NF and has partial dependencies', 'All non-prime attributes are fully functionally dependent on a candidate key', 'There is no lossless join', 'A relation is in 3NF if:', 'DB'),
(14, 'CSE', 3, 'Selection', 'Projection', 'Aggregation', 'Cartesian Product', 'Which of the following operations is not a basic operation of relational algebra?', 'DB'),
(15, 'CSE', 3, 'Encrypting network traffic', 'Translating IP addresses to MAC addresses', 'Translating domain names to IP addresses', 'Handling network routing', 'What is the main function of the DNS (Domain Name System)?', 'CN'),
(16, 'CSE', 1, 'To manage hardware resources', 'To compile programs', 'To execute user programs', 'To provide network services', 'Which of the following is the primary function of an operating system?', 'OS'),
(17, 'CSE', 2, 'Queue', 'Stack', 'Linked list', 'Tree', 'Which data structure is used for implementing a recursive function call?', 'DSA'),
(18, 'CSE', 2, 'QuickSort', 'MergeSort', 'BubbleSort', 'InsertionSort', 'Which sorting algorithm is considered the most efficient in terms of time complexity in the worst-case scenario?', 'DSA'),
(19, 'CSE', 4, 'Encapsulation', 'Inheritance', 'Polymorphism', 'Compilation', 'Which of the following is NOT a principle of Object-Oriented Programming (OOP)?', 'OOPS'),
(20, 'CSE', 3, 'Waterfall Model', 'Spiral Model', 'Agile Model', 'Prototype Model', 'Which of the following is NOT a software development life cycle (SDLC) model?', 'SE'),
(22, 'CSE', 3, 'FCFS (First Come First Serve)', 'Round Robin', 'SJF (Shortest Job First)', 'Priority Scheduling', 'Which scheduling algorithm gives minimum average waiting time?', 'OS'),
(23, 'CSE', 1, 'To manage hardware resources', 'To run applications', 'To compile programs', 'To edit text files', 'What is the primary purpose of an operating system?\r\n\r\n', 'OS'),
(24, 'CSE', 2, 'Shell', 'Kernel', 'GUI', 'File System', 'Which of the following is the core of an operating system?', 'OS'),
(25, 'CSE', 3, 'Batch Operating System', 'Time-Sharing Operating System', 'Real-Time Operating System', 'Distributed Operating System\r\n\r\n', 'Which type of operating system is used in real-time applications?\r\n\r\n', 'OS'),
(26, 'CSE', 2, 'When a process is stuck in an infinite loop', 'When two or more processes wait for each other indefinitely\r\n\r\n', 'When a process executes without waiting', 'When a process releases a resource before using it', 'What is deadlock in an operating system?', 'OS'),
(27, 'CSE', 4, 'New', 'Ready', 'Running', 'Sleeping', 'Which of the following is NOT a process state?', 'OS'),
(28, 'CSE', 3, 'Memory Management', 'Deadlock Detection', 'Process Synchronization', 'CPU Scheduling', 'What is the main purpose of a semaphore?', 'OS');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `usn` varchar(255) DEFAULT NULL,
  `usnorfid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `password`, `role`, `username`, `usn`, `usnorfid`) VALUES
(2, 'abc123', 'Student', '2mm22cs065', '2mm22cs065', '2mm22cs065'),
(3, 'abc123', 'Faculty', 'Ajay', 'Ajay', '4'),
(4, 'abc', 'Admin', 'Admin', 'Admin', '3'),
(5, 'abc', 'Student', '2mm22ec001', '2mm22ec001', '2mm22ec001');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aptitude`
--
ALTER TABLE `aptitude`
  ADD PRIMARY KEY (`q_no`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`fid`);

--
-- Indexes for table `performancematrix`
--
ALTER TABLE `performancematrix`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attempt_no` (`attempt_no`,`sub_name`,`usn`);

--
-- Indexes for table `program_skill`
--
ALTER TABLE `program_skill`
  ADD PRIMARY KEY (`q_no`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `technical_subject_skill`
--
ALTER TABLE `technical_subject_skill`
  ADD PRIMARY KEY (`q_no`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKge3ynwa5gioc9i28fesupl9fi` (`usn`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aptitude`
--
ALTER TABLE `aptitude`
  MODIFY `q_no` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `fid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `performancematrix`
--
ALTER TABLE `performancematrix`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=465;

--
-- AUTO_INCREMENT for table `program_skill`
--
ALTER TABLE `program_skill`
  MODIFY `q_no` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `technical_subject_skill`
--
ALTER TABLE `technical_subject_skill`
  MODIFY `q_no` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
