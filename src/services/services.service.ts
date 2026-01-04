import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.service.findMany();
  }

  findOne(id: string) {
    return this.prisma.service.findUnique({ where: { id } })
  }

  create(data: CreateServiceDto) {
    return this.prisma.service.create({ data });
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.prisma.service.update({ where:{id}, data: updateServiceDto });
  }

  remove(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }
}
