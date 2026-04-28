import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../shared/db/connection.js';
import { brands, brandSubscriptions } from '../shared/db/schema.js';
import { Brand, BrandDetail } from './brand.entity.js';
import { CreateBrandRequest } from './brand.dto.js';

export async function findAllByUserId(userId: string): Promise<Brand[]> {
  return getDb().select().from(brands).where(eq(brands.userId, userId));
}

export async function findById(id: string): Promise<Brand | null> {
  const [brand] = await getDb()
    .select()
    .from(brands)
    .where(eq(brands.id, id))
    .limit(1);
  return brand ?? null;
}

export async function findByIdAndUserIdWithSubscription(id: string, userId: string): Promise<BrandDetail | null> {
  const [row] = await getDb()
    .select({
      brand: brands,
      subscription: brandSubscriptions,
    })
    .from(brands)
    .leftJoin(
      brandSubscriptions,
      and(eq(brandSubscriptions.brandId, brands.id), eq(brandSubscriptions.status, 'active')),
    )
    .where(eq(brands.id, id))
    .limit(1);

  if (!row || row.brand.userId !== userId) return null;
  return { ...row.brand, subscription: row.subscription ?? null };
}

export async function create(userId: string, dto: CreateBrandRequest): Promise<Brand> {
  const id = uuidv4();
  await getDb().insert(brands).values({ id, userId, ...dto });
  return (await findById(id))!;
}
