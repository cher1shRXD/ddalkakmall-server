import { mysqlTable, varchar, mysqlEnum, tinyint, date, timestamp } from "drizzle-orm/mysql-core";
import { brands } from "./brands.js";

export const brandSubscriptions = mysqlTable("brand_subscriptions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  brandId: varchar("brand_id", { length: 36 }).notNull().references(() => brands.id),

  plan: mysqlEnum("plan", ["basic", "plus"]).notNull(),
  status: mysqlEnum("status", ["pending", "active", "failed", "cancelled"]).notNull().default("pending"),

  billingDay: tinyint("billing_day").notNull(),
  rebillExpire: date("rebill_expire").notNull(),
  nextBillAt: date("next_bill_at"),
  lastBilledAt: timestamp("last_billed_at"),

  rebillKey: varchar("rebill_key", { length: 255 }),
  orderNo: varchar("order_no", { length: 64 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
