import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeORMProductsRepository } from './repositories/typeorm-products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    TypeORMProductsRepository, // Просто добавляем репозиторий
  ],
  exports: [ProductsService],
})
export class ProductsModule {}