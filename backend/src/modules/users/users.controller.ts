import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Delete("me")
  removeMe(
    @CurrentUser("id") id: number
  ) {
    return this.usersService.remove(id);
  }

  @Patch("me")
  updateMe(
    @CurrentUser("id") id: number,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.update(id, dto);
  }

  @Get("me")
  getMe(
    @CurrentUser("id") id: number
  ) {
    return this.usersService.findById(id);
  }
}
