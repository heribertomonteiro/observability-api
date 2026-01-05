import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

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

  async proxyRequest(
    id: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body?: any,
  ): Promise<{ status: number; data: any; headers: Record<string, any>; responseTime: number }> {
    const service = await this.prisma.service.findUnique({ where: { id } });

    if (!service || !service.isActive) {
      this.logger.warn('Tentativa de proxy para serviço inexistente ou inativo', { serviceId: id });
      throw new Error('Serviço não encontrado ou inativo');
    }

    const base = service.baseUrl.endsWith('/')
      ? service.baseUrl
      : service.baseUrl + '/';
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    const url = new URL(normalizedPath, base).toString();

    const start = Date.now();

    this.logger.log(`Proxy request started`, {
      serviceId: service.id,
      method,
      url,
    });

    let response;
    try {
      response = await this.http
        .request({
          method,
          url,
          data: body,
        })
        .toPromise();
    } catch (error) {
      const responseTimeOnError = Date.now() - start;

      this.logger.error('Erro ao chamar API externa', error.stack || error.message, {
        serviceId: service.id,
        method,
        url,
        responseTime: responseTimeOnError,
      });

      // Ainda assim registramos a métrica de erro como EXTERNAL
      await this.prisma.metric.create({
        data: {
          serviceId: service.id,
          method,
          route: path,
          responseTime: responseTimeOnError,
          origin: 'EXTERNAL',
        },
      });

      throw error;
    }

    const responseTime = Date.now() - start;

    await this.prisma.metric.create({
      data: {
        serviceId: service.id,
        method,
        route: path,
        responseTime,
        origin: 'EXTERNAL',
      },
    });

    if (!response) {
      throw new Error('Nenhuma resposta da API externa');
    }

    this.logger.log('Proxy request completed', {
      serviceId: service.id,
      method,
      url,
      status: response.status,
      responseTime,
    });

    return {
      status: response.status,
      data: response.data,
      headers: response.headers as any,
      responseTime,
    };
  }
}
