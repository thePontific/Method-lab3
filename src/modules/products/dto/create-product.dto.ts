import {
  IsString,
  IsNumber,
  Min,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(3, { message: 'Название должно быть не менее 3 символов' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @Type(() => Number)
  @Min(0)
  @IsOptional()
  @IsNumber()
  stockQuantity?: number;
}
