// import {
//   Controller,
//   Post,
//   Get,
//   UseInterceptors,
//   UploadedFile,
//   Body,
//   UseGuards,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { ProductsService } from './products.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('products')
// export class ProductsController {
//   constructor(private readonly productsService: ProductsService) {}

//   // 🔥 THIS FIXES YOUR ERROR
//   @Get()
//   @UseGuards(JwtAuthGuard)
//   findAll() {
//     return this.productsService.findAll();
//   }

//   @Post('upload')
//   @UseGuards(JwtAuthGuard)
//   @UseInterceptors(
//     FileInterceptor('image', {
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (req, file, cb) => {
//           const uniqueName =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           cb(null, uniqueName + extname(file.originalname));
//         },
//       }),
//     }),
//   )
//   async uploadProduct(
//     @UploadedFile() file: any,
//     @Body() body: any,
//   ) {
//     const imageUrl = `http://localhost:3000/uploads/${file.filename}`;

//     return this.productsService.create({
//       ...body,
//       imageUrl,
//     });
//   }
// }


import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ PUBLIC
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // ✅ ADMIN – upload product with image
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const imageUrl = file
      ? `http://localhost:3000/uploads/${file.filename}`
      : null;

    return this.productsService.create({
      ...body,
      imageUrl,
    });
  }
}
