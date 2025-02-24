import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { Auth } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([Auth]), JwtModule.register({
    secret: process.env.JWT_SECRET || 'mysecretkey',
    signOptions: { expiresIn: '1h' },
  }),], // Import TypeOrmModule with Product entity
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [TypeOrmModule], // Export if other modules need access
})
export class ProductsModule { }
