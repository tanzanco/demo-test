import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsOptional, IsString, IsNumber, Length, Min, Max } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters long' })
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber({ allowNaN: false }, { message: 'Please enter a valid number for price' })
    @Min(0.01, { message: 'Price must be greater than 0' })
    @Max(1000000, { message: 'Price must be less than 1,000,000' })
    price: number;
}
