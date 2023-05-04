import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ROLES } from 'src/config';
import { RolesGuard } from 'src/auth/guard/role.guard';
// import { PoliciesGuard } from 'src/auth/guard/policy.guard';
import { AbilityGuard } from 'src/auth/guard/ability.guard';
import { Roles, CurrentUser, CheckAbilities } from 'src/decorators';
import {
  Action,
  AppAbility,
  Post as Blog,
} from 'src/casl/casl-ability.factory';

const blog = new Blog();
blog.id = 2;
blog.content = 'test test';
blog.created_by = 1;

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Roles(ROLES.admin)
  @UseGuards(RolesGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postsService.create(createPostDto, currentUser);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @UseGuards(AbilityGuard)
  @CheckAbilities({ action: Action.Read, subject: blog })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AbilityGuard)
  @CheckAbilities({ action: Action.Update, subject: Blog })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
