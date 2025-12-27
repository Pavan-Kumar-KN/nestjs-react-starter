import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, Product, UpdateProductDto } from '@repo/types';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  create(createProductDto: CreateProductDto) {
    const newProduct: Product = {
      id: (this.products.length + 1).toString(),
      ...createProductDto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, updateProductDto);
    return product;
  }

  remove(id: string): Product | undefined {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const removedProduct = this.products.splice(index, 1)[0];
    return removedProduct;
  }
}
