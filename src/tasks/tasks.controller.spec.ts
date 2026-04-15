import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Desc',
  status: 'OPEN',
};

const mockPaginatedResult = {
  rows: [mockTask],
  totalItems: 1,
  totalPages: 1,
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  nextPage: null,
  previousPage: null,
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTask),
            findAll: jest.fn().mockResolvedValue(mockPaginatedResult),
            findOne: jest.fn().mockResolvedValue(mockTask),
            update: jest.fn().mockResolvedValue({ ...mockTask, status: 'DONE' }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto: CreateTaskDto = { title: 'Test Task' };
      expect(await controller.create(dto)).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      expect(await controller.findAll({ page: 1, limit: 10 })).toEqual(mockPaginatedResult);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      expect(await controller.findOne(1)).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      expect(await controller.update(1, { status: 'DONE' })).toEqual({ ...mockTask, status: 'DONE' });
      expect(service.update).toHaveBeenCalledWith(1, { status: 'DONE' });
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
