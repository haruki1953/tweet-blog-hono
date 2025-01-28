PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posts_to_images` (
	`post_id` text NOT NULL,
	`image_id` text NOT NULL,
	PRIMARY KEY(`post_id`, `image_id`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_posts_to_images`("post_id", "image_id") SELECT "post_id", "image_id" FROM `posts_to_images`;--> statement-breakpoint
DROP TABLE `posts_to_images`;--> statement-breakpoint
ALTER TABLE `__new_posts_to_images` RENAME TO `posts_to_images`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`added_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`content` text NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL,
	`images_order` text,
	`parent_post_id` text,
	FOREIGN KEY (`parent_post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "updated_at", "created_at", "added_at", "content", "is_deleted", "images_order", "parent_post_id") SELECT "id", "updated_at", "created_at", "added_at", "content", "is_deleted", "images_order", "parent_post_id" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;