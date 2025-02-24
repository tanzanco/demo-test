import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateAuthDto {
    @IsNotEmpty({ message: 'Username is required' })
    username: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @Length(8, 12, { message: 'Password must be between 8 and 12 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    password: string;
}
