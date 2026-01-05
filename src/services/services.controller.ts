import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo serviço' })
  @ApiResponse({ status: 201, description: 'Serviço criado com sucesso.' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os serviços' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um serviço por ID' })
  @ApiResponse({ status: 200, description: 'Serviço encontrado.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um serviço' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um serviço' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicesService.remove(id);
  }

  @Get(':id/proxy/*path')
  @ApiOperation({ summary: 'Proxy para uma API externa cadastrada' })
  async proxyGet(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('path') path: string,
  ): Promise<{ status: number; data: any; headers: Record<string, any>; responseTime: number }> {
    return this.servicesService.proxyRequest(
      id,
      'GET',
      path.startsWith('/') ? path : `/${path}`,
    );
  }
}
