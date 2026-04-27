import { User } from './user.entity.js';
import { UpdateProfileRequest } from './user.dto.js';
import * as userRepository from './user.repository.js';

export async function findOrCreate(input: {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  avatar: string;
}): Promise<User> {
  const existing = await userRepository.findByProvider(input.provider, input.providerId);
  if (existing) return existing;
  return userRepository.create(input);
}

export async function getById(id: string): Promise<User | null> {
  return userRepository.findById(id);
}

export async function updateProfile(id: string, dto: UpdateProfileRequest): Promise<User | null> {
  return userRepository.updateProfile(id, dto);
}
