import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

const numberTransformer = {
  to: (value: number) => value,
  from: (value: string | null) =>
    value !== null ? parseFloat(value) : null,
};

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: numberTransformer,
  })
  price: number;

  @Column({ name: 'category', length: 100, nullable: true })
  category: string;

  @Column({ name: 'in_stock', default: true })
  inStock: boolean;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity: number;

  @Exclude()
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
