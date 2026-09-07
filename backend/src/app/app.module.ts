import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersModule } from '../modules/users/users.module.js';
import { AuthModule } from '../modules/auth/auth.module.js';

@Module({
  imports: [
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService]
})
export class AppModule { }
