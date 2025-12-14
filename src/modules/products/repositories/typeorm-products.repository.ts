import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../entities/product.entity';
import { ProductFiltersDto } from '../dto/product-filters.dto'; 

@Injectable()
export class TypeORMProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async findAll(filters?: ProductFiltersDto): Promise<ProductEntity[]> {
    const query = this.repository.createQueryBuilder('product');

    if (!filters?.includeDeleted) {
      query.where('product.is_deleted = false');
    }

    if (filters?.search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.category) {
      query.andWhere('product.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.inStock !== undefined) {
      query.andWhere('product.in_stock = :inStock', {
        inStock: filters.inStock,
      });
    }

    if (filters?.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters?.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    return await query.getMany();
  }

  async findById(id: number): Promise<ProductEntity | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(data: Partial<ProductEntity>): Promise<ProductEntity> {
    const product = this.repository.create(data);
    return await this.repository.save(product);
  }
  async update(
    id: number,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    await this.repository.update(id, data);

    const updatedProduct = await this.findById(id);
    if (!updatedProduct) {
      throw new Error(`Product with id ${id} not found after update`);
    }

    return updatedProduct;
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.update(id, {
      isDeleted: true,
      inStock: false,
    });
  }
}
