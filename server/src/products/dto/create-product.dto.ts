import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max, Length } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters long' })
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber({ allowNaN: false }, { message: 'Please enter a valid number for price' })
    @Min(0.01, { message: 'Price must be greater than 0' })
    @Max(1000000, { message: 'Price must be less than 1,000,000' })
    price: number;
}
