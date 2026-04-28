import { Brand, BrandDetail } from './brand.entity.js';
import { CreateBrandRequest } from './brand.dto.js';
import * as brandRepository from './brand.repository.js';

export async function getMyBrands(userId: string): Promise<Brand[]> {
  return brandRepository.findAllByUserId(userId);
}

export async function getMyBrand(id: string, userId: string): Promise<BrandDetail | null> {
  return brandRepository.findByIdAndUserIdWithSubscription(id, userId);
}

export async function createBrand(userId: string, dto: CreateBrandRequest): Promise<Brand> {
  return brandRepository.create(userId, dto);
}
