import { ApiProperty } from '@nestjs/swagger';

export class Metric {
	@ApiProperty({ description: 'ID da métrica' })
	id: string;

	@ApiProperty({ description: 'ID do serviço associado (interno ou externo)' })
	serviceId: string;

	@ApiProperty({ description: 'Rota acessada', example: '/services' })
	route: string;

	@ApiProperty({ description: 'Método HTTP utilizado', example: 'GET' })
	method: string;

	@ApiProperty({ description: 'Tempo de resposta em milissegundos' })
	responseTime: number;

	@ApiProperty({ description: 'Origem da métrica', example: 'INTERNAL' })
	origin: 'INTERNAL' | 'EXTERNAL';

	@ApiProperty({ description: 'Data de criação da métrica' })
	createdAt: Date;
}
