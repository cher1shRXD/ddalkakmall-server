import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  avatar: varchar("avatar", { length: 512 }),
  provider: varchar("provider", { length: 20 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  zipcode: varchar("zipcode", { length: 10 }),
  address: varchar("address", { length: 500 }),
  addressDetail: varchar("address_detail", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
