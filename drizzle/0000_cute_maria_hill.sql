CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`avatar` varchar(512),
	`provider` varchar(20) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`phone` varchar(20),
	`zipcode` varchar(10),
	`address` varchar(500),
	`address_detail` varchar(200),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
