import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface HelloBody {
  code: string;
}

describe('HelloController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/hello returns a 6-digit code', async () => {
    const res = await request(app.getHttpServer()).get('/api/hello').expect(200);
    const body = res.body as HelloBody;

    expect(body).toHaveProperty('code');
    expect(typeof body.code).toBe('string');
    expect(body.code).toHaveLength(6);
    expect(/^\d{6}$/.test(body.code)).toBe(true);
  });

  it('GET /api/hello returns different codes on successive calls', async () => {
    const results = await Promise.all(
      Array.from({ length: 5 }, () => request(app.getHttpServer()).get('/api/hello').expect(200)),
    );
    const codes = results.map((r) => (r.body as HelloBody).code);
    const unique = new Set(codes);
    expect(unique.size).toBeGreaterThan(1);
  });
});
