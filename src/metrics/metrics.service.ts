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

  async getStatsByOrigin(origin: 'INTERNAL' | 'EXTERNAL') {
    const groups = await this.prisma.metric.groupBy({
      by: ['serviceId', 'route'],
      where: { origin },
      _count: { _all: true },
      _avg: { responseTime: true },
      _min: { responseTime: true, createdAt: true },
      _max: { responseTime: true, createdAt: true },
      orderBy: { _avg: { responseTime: 'desc' } },
    });

    return groups.map((g) => ({
      serviceId: g.serviceId,
      route: g.route,
      count: g._count._all,
      avgResponseTime: g._avg.responseTime,
      minResponseTime: g._min.responseTime,
      maxResponseTime: g._max.responseTime,
      firstSeenAt: g._min.createdAt,
      lastSeenAt: g._max.createdAt,
    }));
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