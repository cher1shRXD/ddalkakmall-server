import { mysqlTable, varchar, mysqlEnum, tinyint, date, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  avatar: varchar('avatar', { length: 512 }),
  provider: varchar('provider', { length: 20 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  zipcode: varchar('zipcode', { length: 10 }),
  address: varchar('address', { length: 500 }),
  addressDetail: varchar('address_detail', { length: 200 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const brands = mysqlTable('brands', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const brandSubscriptions = mysqlTable('brand_subscriptions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  brandId: varchar('brand_id', { length: 36 }).notNull().references(() => brands.id),
  plan: mysqlEnum('plan', ['basic', 'plus']).notNull(),
  status: mysqlEnum('status', ['pending', 'active', 'failed', 'cancelled']).notNull().default('pending'),
  billingDay: tinyint('billing_day').notNull(),
  rebillExpire: date('rebill_expire').notNull(),
  nextBillAt: date('next_bill_at'),
  lastBilledAt: timestamp('last_billed_at'),
  rebillKey: varchar('rebill_key', { length: 255 }),
  orderNo: varchar('order_no', { length: 64 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
