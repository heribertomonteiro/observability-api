import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'User Service', description: 'Nome legível do serviço' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://users.mycompany.com', description: 'URL base do serviço' })
  @IsUrl()
  baseUrl: string;

  @ApiPropertyOptional({ example: true, description: 'Se o serviço está ativo' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}