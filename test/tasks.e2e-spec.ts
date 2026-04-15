import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { Reflector } from '@nestjs/core';

describe('Tasks & Auth (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Use the same validation pipe as in main.ts
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));
    
    app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    // Get a token for subsequent tests
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' });
    
    accessToken = response.body.data.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('/tasks (GET) - Should fail without token', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(401);
    });

    it('/auth/login (POST) - Should fail with wrong credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'wrong', password: 'user' })
        .expect(401);
    });
  });

  describe('Tasks CRUD', () => {
    it('/tasks (POST) - Should create a task when authorized', async () => {
      const taskData = {
        title: 'E2E Test Task',
        description: 'Testing the whole flow',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.status).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.id).toBeDefined();
    });

    it('/tasks (GET) - Should fetch tasks with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks?page=1&limit=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data).toHaveProperty('rows');
      expect(response.body.data).toHaveProperty('totalItems');
      expect(Array.isArray(response.body.data.rows)).toBe(true);
    });
  });
});
