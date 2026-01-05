import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateMetricDto) {
    return this.prisma.metric.create({ data });
  }

  findAll() {
    return this.prisma.metric.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findByOrigin(origin: 'INTERNAL' | 'EXTERNAL') {
    return this.prisma.metric.findMany({
      where: { origin },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.metric.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateMetricDto) {
    return this.prisma.metric.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.metric.delete({
      where: { id },
    });
  }
}