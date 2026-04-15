import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  // Creates a new task in the database
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.taskModel.create(createTaskDto as any);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  // Fetches a list of tasks with filtering and pagination
  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Task>> {
    try {
      const page = paginationDto.page ?? 1;
      const limit = paginationDto.limit ?? 10;
      const offset = (page - 1) * limit;

      const whereClause: any = {};
      if (paginationDto.status) {
        whereClause.status = paginationDto.status;
      }

      const { count, rows } = await this.taskModel.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      const totalPages = Math.ceil(count / limit);

      return {
        rows,
        totalItems: count,
        totalPages,
        currentPage: Number(page),
        hasNextPage: Number(page) < totalPages,
        hasPreviousPage: Number(page) > 1,
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        previousPage: Number(page) > 1 ? Number(page) - 1 : null,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  // Finds one task by its ID
  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.taskModel.findByPk(id);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to get task details');
    }
  }

  // Updates an existing task
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.findOne(id);
      return await task.update(updateTaskDto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  // Deletes a task by ID
  async remove(id: number): Promise<void> {
    try {
      const task = await this.findOne(id);
      await task.destroy(); // Performs soft delete because paranoid: true
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
