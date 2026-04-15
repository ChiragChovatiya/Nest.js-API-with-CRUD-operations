import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getModelToken } from '@nestjs/sequelize';
import { Task } from './task.model';
import { NotFoundException } from '@nestjs/common';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Desc',
  status: 'OPEN',
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;
  let model: typeof Task;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task),
          useValue: {
            create: jest.fn().mockResolvedValue(mockTask),
            findAndCountAll: jest.fn().mockResolvedValue({ rows: [mockTask], count: 1 }),
            findByPk: jest.fn().mockResolvedValue(mockTask),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    model = module.get<typeof Task>(getModelToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully insert a task', async () => {
      expect(await service.create({ title: 'Test Task' })).toEqual(mockTask);
      expect(model.create).toHaveBeenCalledWith({ title: 'Test Task' });
    });
  });

  describe('findAll', () => {
    it('should return a list of tasks with pagination metadata', async () => {
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result).toEqual({
        rows: [mockTask],
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        previousPage: null,
      });
      expect(model.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific task', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);
      expect(model.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw out NotFoundException if it does not exist', async () => {
      jest.spyOn(model, 'findByPk').mockResolvedValueOnce(null as any);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should partially update the item', async () => {
      jest.spyOn(mockTask, 'update').mockResolvedValueOnce({ ...mockTask, status: 'DONE' } as any);
      const result = await service.update(1, { status: 'DONE' });
      expect(result.status).toEqual('DONE');
      expect(mockTask.update).toHaveBeenCalledWith({ status: 'DONE' });
    });
  });

  describe('remove', () => {
    it('should destroy (soft delete) the task', async () => {
      await service.remove(1);
      expect(mockTask.destroy).toHaveBeenCalled();
    });
  });
});
