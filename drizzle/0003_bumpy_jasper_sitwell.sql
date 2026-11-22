DROP INDEX "officials_sort_order_unique";--> statement-breakpoint
CREATE INDEX "officials_sort_order_idx" ON "officials" USING btree ("sort_order");