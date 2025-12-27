import { CreateProductDto } from "../dto/create-product.dto";

export interface Product extends CreateProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
}