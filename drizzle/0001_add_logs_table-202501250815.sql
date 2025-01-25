CREATE TABLE `logs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`content` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
