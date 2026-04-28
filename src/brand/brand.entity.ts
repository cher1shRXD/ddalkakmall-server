import { brands, brandSubscriptions } from '../shared/db/schema.js';

export type Brand = typeof brands.$inferSelect;
export type BrandSubscription = typeof brandSubscriptions.$inferSelect;

export interface BrandDetail extends Brand {
  subscription: BrandSubscription | null;
}
