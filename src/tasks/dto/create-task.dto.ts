import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy groceries', description: 'The title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Milk, bread, and eggs', description: 'Detailed description of what needs to be done' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ['OPEN', 'IN_PROGRESS', 'DONE'], example: 'OPEN', description: 'The current status of the task' })
  @IsEnum(['OPEN', 'IN_PROGRESS', 'DONE'])
  @IsOptional()
  status?: string;
}
