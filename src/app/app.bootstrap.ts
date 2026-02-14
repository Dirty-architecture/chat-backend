import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import {RedisClient} from "@/app/redis/redis.client";
import {SessionConfigFactory} from "@/app/session/session.config";
import {CorsConfig} from "@/app/cors/cors.config";
import cors from '@fastify/cors'

export class AppBootstrap {
  private app: NestFastifyApplication;
  private configService: ConfigService;
  private redisClient: RedisClient;
  private logger = new Logger('Bootstrap');

  constructor() {}

  async initialize(): Promise<void> {
    await this.createApp();
    await this.setupRedis();
    await this.setupCookies();
    await this.setupSession();
    await this.setupCors();
    this.setupGlobalPipes();
    this.enableShutdownHooks();
  }

  private async createApp(): Promise<void> {
    this.app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );
    this.configService = this.app.get(ConfigService);
  }

  private async setupRedis(): Promise<void> {
    this.redisClient = new RedisClient(this.configService);
    await this.redisClient.connect();
  }

  private async setupCookies(): Promise<void> {
    // @ts-ignore
    await this.app.register(fastifyCookie, {
      secret: this.configService.getOrThrow<string>('COOKIES_SECRET'),
    });
  }

  private async setupSession(): Promise<void> {
    const sessionConfigFactory = new SessionConfigFactory(this.configService);
    const sessionConfig = sessionConfigFactory.create(this.redisClient.getClient());

    // @ts-ignore
    await this.app.register(fastifySession, sessionConfig.options);
  }

  private async setupCors(): Promise<void> {
    const corsOptions = CorsConfig.create(this.configService);

    // @ts-ignore
    await this.app.register(cors, corsOptions);
  }

  private setupGlobalPipes(): void {
    this.app.useGlobalPipes(new ValidationPipe({ transform: true }));
  }

  private enableShutdownHooks(): void {
    this.app.enableShutdownHooks();
  }

  async start(): Promise<void> {
    const port = this.configService.getOrThrow<number>('APPLICATION_PORT');

    await this.app.listen(port, '0.0.0.0', () => {
      this.logger.debug(`Application is running on port ${port}`);
      this.logger.debug(`Environment: ${process.env.NODE_ENV || 'development'}`);
      this.logger.debug(`Allowed origin: ${this.configService.get('ALLOWED_ORIGIN')}`);
    });
  }

  getApp(): NestFastifyApplication {
    return this.app;
  }
}