import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: '2023-11-20T10:00:00Z', description: 'When the task was completed' })
  @IsDateString()
  @IsOptional()
  completedAt?: Date;
}
