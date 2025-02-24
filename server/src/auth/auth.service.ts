import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto): Promise<{ token: string }> {
    const userExists = await this.authRepository.findOne({ where: { email: dto.email } });

    if (userExists) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }

    // const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.authRepository.create({ ...dto });
    await this.authRepository.save(user);

    const token = this.generateToken(user);
    return { token };
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    const user = await this.authRepository.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new HttpException('Invalid email/password', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid email/password', HttpStatus.UNAUTHORIZED);
    }

    const token = this.generateToken(user);
    return { token };
  }

  private generateToken(user: Auth): string {
    return this.jwtService.sign({ userId: user.id, email: user.email });
  }
}
