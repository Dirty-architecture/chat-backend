import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class RedisClient implements OnModuleDestroy {
  private client: RedisClientType;

  constructor(private configService: ConfigService) {}

  async connect(): Promise<RedisClientType> {
    const redisUri = this.configService.getOrThrow<string>('REDIS_URI');
    this.client = createClient({ url: redisUri }) as RedisClientType;
    await this.client.connect();
    return this.client;
  }

  getClient(): RedisClientType {
    if (!this.client) {
      throw new Error('Redis client not connected');
    }
    return this.client;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }
}