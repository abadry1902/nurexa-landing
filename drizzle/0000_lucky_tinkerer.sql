CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`journey_id` text NOT NULL,
	`event` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `journeys` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`data` text NOT NULL,
	`step` integer DEFAULT 1 NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`source` text NOT NULL,
	`chat` text DEFAULT '[]' NOT NULL,
	`intent` text DEFAULT 'signup' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
