import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { Metric } from './entities/metric.entity';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma métrica manualmente (apenas para testes)' })
  @ApiOkResponse({ type: Metric })
  create(@Body() createMetricDto: CreateMetricDto) {
    return this.metricsService.create(createMetricDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as métricas (internas e externas)' })
  @ApiOkResponse({ type: Metric, isArray: true })
  findAll() {
    return this.metricsService.findAll();
  }

  @Get('internal')
  @ApiOperation({ summary: 'Listar apenas métricas internas (requisições da própria API)' })
  @ApiOkResponse({ type: Metric, isArray: true })
  findInternal() {
    return this.metricsService.findByOrigin('INTERNAL');
  }

  @Get('external')
  @ApiOperation({ summary: 'Listar apenas métricas externas (APIs chamadas via proxy)' })
  @ApiOkResponse({ type: Metric, isArray: true })
  findExternal() {
    return this.metricsService.findByOrigin('EXTERNAL');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metricsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetricDto: UpdateMetricDto) {
    return this.metricsService.update(id, updateMetricDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metricsService.remove(id);
  }
}
