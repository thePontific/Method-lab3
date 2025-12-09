import { ProductEntity } from '../../../entities/product.entity';
import { ProductFiltersDto } from '../dto/product-filters.dto';

export interface IProductsRepository {
  findAll(filters?: ProductFiltersDto): Promise<ProductEntity[]>;
  findById(id: number): Promise<ProductEntity | null>;
  create(data: Partial<ProductEntity>): Promise<ProductEntity>;
  update(id: number, data: Partial<ProductEntity>): Promise<ProductEntity>;
  softDelete(id: number): Promise<void>;
}