import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  // Creates a new task
  @Post()
  @ResponseMessage('Task created successfully')
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body(ValidationPipe) createTaskDto: CreateTaskDto) {
    try {
      return await this.tasksService.create(createTaskDto);
    } catch (error) {
      throw error;
    }
  }

  // Retrieves all tasks with pagination
  @Get()
  @ResponseMessage('Tasks retrieved successfully')
  @ApiOperation({ summary: 'Get all tasks with pagination' })
  @ApiResponse({ status: 200, description: 'Return all tasks.' })
  async findAll(@Query(ValidationPipe) paginationDto: PaginationDto) {
    try {
      return await this.tasksService.findAll(paginationDto);
    } catch (error) {
      throw error;
    }
  }

  // Retrieves a single task by ID
  @Get(':id')
  @ResponseMessage('Task details retrieved successfully')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.tasksService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  // Updates specific fields of an existing task
  @Patch(':id')
  @ResponseMessage('Task updated successfully')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
  ) {
    try {
      return await this.tasksService.update(id, updateTaskDto);
    } catch (error) {
      throw error;
    }
  }

  // Soft deletes a task
  @Delete(':id')
  @ResponseMessage('Task deleted successfully')
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.tasksService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
