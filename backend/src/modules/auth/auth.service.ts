import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  private async generateTokens(userId: number) {
    const payload = {
      sub: userId
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);

    return this.generateTokens(user.id);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordValid = await argon2.verify(user.password, dto.password);

    if (!passwordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.generateTokens(user.id);
  }
}
