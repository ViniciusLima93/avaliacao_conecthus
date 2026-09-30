import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllUsersQueryDto } from '../../application/dtos/find-all-users-query.dto';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import {
  PaginatedUserResponseDto,
  UserResponseDto,
} from '../../application/dtos/user-response.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user/delete-user.use-case';
import { FindAllUserUseCase } from '../../application/use-cases/find-all-user/find-all-user.use-case';
import { FindByIdUserUseCase } from '../../application/use-cases/find-by-id-user/find-by-id-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user/update-user.use-case';
import {
  ApiCreateUser,
  ApiDeleteUser,
  ApiFindAllUsers,
  ApiFindUserById,
  ApiUpdateUser,
} from './user.docs';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findAllUser: FindAllUserUseCase,
    private readonly findByIdUser: FindByIdUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiCreateUser()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return UserResponseDto.fromEntity(await this.createUser.execute(dto));
  }

  @Get()
  @ApiFindAllUsers()
  async findAll(
    @Query() query: FindAllUsersQueryDto,
  ): Promise<PaginatedUserResponseDto> {
    const result = await this.findAllUser.execute(query);
    return {
      data: result.data.map((user) => UserResponseDto.fromEntity(user)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiFindUserById()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return UserResponseDto.fromEntity(await this.findByIdUser.execute(id));
  }

  @Patch(':id')
  @ApiUpdateUser()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return UserResponseDto.fromEntity(await this.updateUser.execute(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteUser()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteUser.execute(id);
  }
}
