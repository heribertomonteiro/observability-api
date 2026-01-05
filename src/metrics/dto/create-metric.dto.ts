import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMetricDto {
	@ApiProperty({ description: 'ID do serviço ao qual a métrica pertence' })
	@IsString()
	serviceId: string;

	@ApiProperty({ description: 'Método HTTP da requisição (GET, POST, ...)' })
	@IsString()
	method: string;

	@ApiProperty({ description: 'Rota acessada na aplicação' })
	@IsString()
	route: string;

	@ApiProperty({ description: 'Tempo de resposta em milissegundos' })
	@IsInt()
	@Min(0)
	responseTime: number;

	@ApiPropertyOptional({ description: 'Origem da métrica (INTERNAL ou EXTERNAL)', enum: ['INTERNAL', 'EXTERNAL'] })
	@IsOptional()
	@IsEnum(['INTERNAL', 'EXTERNAL'])
	origin?: 'INTERNAL' | 'EXTERNAL';
}
