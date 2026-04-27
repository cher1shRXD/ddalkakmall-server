import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../shared/db/connection.js';
import { users } from '../shared/db/schema/users.js';
import { User } from './user.entity.js';
import { UpdateProfileRequest } from './user.dto.js';

export async function findByProvider(provider: string, providerId: string): Promise<User | null> {
  const [user] = await getDb()
    .select()
    .from(users)
    .where(and(eq(users.provider, provider), eq(users.providerId, providerId)))
    .limit(1);
  return user ?? null;
}

export async function findById(id: string): Promise<User | null> {
  const [user] = await getDb()
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user ?? null;
}

export async function create(payload: {
  email: string;
  name: string;
  avatar: string;
  provider: string;
  providerId: string;
}): Promise<User> {
  const id = uuidv4();
  await getDb().insert(users).values({ id, ...payload });
  return (await findById(id))!;
}

export async function updateProfile(id: string, dto: UpdateProfileRequest): Promise<User | null> {
  const patch: Partial<typeof users.$inferInsert> = {};
  if (dto.phone !== undefined)         patch.phone = dto.phone;
  if (dto.zipcode !== undefined)       patch.zipcode = dto.zipcode;
  if (dto.address !== undefined)       patch.address = dto.address;
  if (dto.addressDetail !== undefined) patch.addressDetail = dto.addressDetail;

  await getDb().update(users).set(patch).where(eq(users.id, id));
  return findById(id);
}
