import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import * as argon2 from "argon2";
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    });

    if (existingUser) {
      throw new ConflictException("Email is already in use");
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: passwordHash
      }
    });

    return this.toPublicUser(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return users.map((user) => this.toPublicUser(user));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.toPublicUser(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: {
      email?: string;
      name?: string;
      password?: string;
    } = {};

    if (dto.email !== undefined) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email }
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException("Email is already in use");
      }

      data.email = dto.email;
    }

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.password !== undefined) {
      data.password = await argon2.hash(dto.password);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data
    });

    return this.toPublicUser(user);
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id }
    });

    return {
      message: "User deleted"
    }
  }

  private toPublicUser(user: any) {
    const { password, ...publicUser } = user;
    return publicUser;
  }
}
