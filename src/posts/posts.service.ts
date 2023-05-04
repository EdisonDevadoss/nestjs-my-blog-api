import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto, currentUser: User) {
    const params = {
      ...createPostDto,
      created_by: currentUser.id,
    };
    return this.prisma.post.create({ data: params });
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    // return `This action returns a #${id} post`;
    return this.prisma.post.findFirst({ where: { id } });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
