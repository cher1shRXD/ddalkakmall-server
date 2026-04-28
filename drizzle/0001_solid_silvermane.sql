CREATE TABLE `brand_subscriptions` (
	`id` varchar(36) NOT NULL,
	`brand_id` varchar(36) NOT NULL,
	`plan` enum('basic','plus') NOT NULL,
	`status` enum('pending','active','failed','cancelled') NOT NULL DEFAULT 'pending',
	`billing_day` tinyint NOT NULL,
	`rebill_expire` date NOT NULL,
	`next_bill_at` date,
	`last_billed_at` timestamp,
	`rebill_key` varchar(255),
	`order_no` varchar(64) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brand_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `brand_subscriptions` ADD CONSTRAINT `brand_subscriptions_brand_id_brands_id_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `brands` ADD CONSTRAINT `brands_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;