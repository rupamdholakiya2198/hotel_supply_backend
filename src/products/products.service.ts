// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from './product.entity';

// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectRepository(Product)
//     private productRepo: Repository<Product>,
//   ) {}

//   async create(product: Partial<Product>) {
//   try {
//     return await this.productRepo.save(product);
//   } catch (error) {
//     if (error.code === 'ER_DUP_ENTRY') {
//       throw new Error('Product with this name already exists');
//     }
//     throw error;
//   }
// }


//   findAll() {
//     return this.productRepo.find({ where: { isActive: true } });
//   }

//   update(id: number, data: Partial<Product>) {
//     return this.productRepo.update(id, data);
//   }

//   softDelete(id: number) {
//   return this.productRepo.update(id, { isActive: false });
// }

// }


import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {}

  async create(data: Partial<Product>) {
    try {
      return await this.repo.save(data);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Product already exists');
      }
      throw err;
    }
  }

  findAll() {
    return this.repo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}
