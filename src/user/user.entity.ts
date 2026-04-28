import { users } from '../shared/db/schema.js';

export type User = typeof users.$inferSelect;
