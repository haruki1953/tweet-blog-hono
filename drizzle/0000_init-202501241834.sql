CREATE TABLE `image_forwards` (
	`id` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`platform_image_id` text NOT NULL,
	`link` text NOT NULL,
	`forward_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`forward_config_id` text NOT NULL,
	`image_id` text NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `image_imports` (
	`id` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`platform_image_id` text NOT NULL,
	`link` text NOT NULL,
	`imported_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`image_id` text NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`alt` text,
	`path` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`added_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`small_size` integer DEFAULT 0 NOT NULL,
	`large_size` integer DEFAULT 0 NOT NULL,
	`original_size` integer DEFAULT 0 NOT NULL,
	`original_path` text
);
--> statement-breakpoint
CREATE TABLE `post_forwards` (
	`id` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`platform_post_id` text NOT NULL,
	`link` text NOT NULL,
	`forward_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`forward_config_id` text NOT NULL,
	`post_id` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `post_imports` (
	`id` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`platform_post_id` text NOT NULL,
	`link` text NOT NULL,
	`imported_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`post_id` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`added_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`content` text NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL,
	`images_order` text,
	`parent_post_id` text
);
--> statement-breakpoint
CREATE TABLE `posts_to_images` (
	`post_id` text NOT NULL,
	`image_id` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE no action
);
