import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TypeORMProductsRepository } from './repositories/typeorm-products.repository'; // Конкретный класс
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: TypeORMProductsRepository, // Конкретная реализация
  ) {}

  async findAll(filters: ProductFiltersDto) {
    if (filters.includeDeleted === undefined) {
      filters.includeDeleted = false;
    }
    
    return await this.productsRepository.findAll(filters);
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findById(id);
    
    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }
    
    if (product.isDeleted) {
      throw new NotFoundException(`Товар с ID ${id} удален`);
    }
    
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    if (createProductDto.stockQuantity === 0) {
      createProductDto.inStock = false;
    }
    
    return await this.productsRepository.create(createProductDto);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    
    const product = await this.productsRepository.findById(id);
    if (product?.isDeleted) {
      throw new BadRequestException('Нельзя обновлять удаленный товар');
    }
    
    if (updateProductDto.stockQuantity !== undefined) {
      updateProductDto.inStock = updateProductDto.stockQuantity > 0;
    }
    
    return await this.productsRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.productsRepository.softDelete(id);
  }
}