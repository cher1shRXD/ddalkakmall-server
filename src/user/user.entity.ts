import { users } from '../shared/db/schema/users.js';

export type User = typeof users.$inferSelect;
