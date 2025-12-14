// dto/product-response.dto.ts
export class ProductResponseDto {
  id: number;
  name: string;
  imageUrl: string | null; // Добавьте это поле
  description: string | null;
  price: number;
  category: string | null;
  inStock: boolean;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}