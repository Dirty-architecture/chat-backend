import { ConfigService } from '@nestjs/config';
import { FastifySessionOptions } from '@fastify/session';
import { RedisStore } from 'connect-redis';
import { ms, StringValue, parseBoolean } from '@/shared';
import { RedisClientType } from 'redis';

export interface SessionConfig {
  options: FastifySessionOptions;
  redisClient: RedisClientType;
}

export class SessionConfigFactory {
  constructor(private configService: ConfigService) {}

  create(redisClient: RedisClientType): SessionConfig {
    return {
      redisClient,
      options: {
        secret: this.configService.getOrThrow<string>('SESSION_SECRET'),
        cookieName: this.configService.getOrThrow<string>('SESSION_NAME'),
        saveUninitialized: false,
        cookie: {
          // domain: this.configService.getOrThrow<string>('SESSION_DOMAIN'),
          maxAge: ms(this.configService.getOrThrow<StringValue>('SESSION_MAX_AGE')),
          httpOnly: parseBoolean(this.configService.getOrThrow('SESSION_HTTP_ONLY')),
          // secure: parseBoolean(this.configService.getOrThrow('SESSION_SECURE')),
          secure: true,
          sameSite: 'none' as const,
          partitioned: true
        },
        store: new RedisStore({
          client: redisClient,
          prefix: this.configService.getOrThrow<string>('SESSION_FOLDER'),
        }),
      },
    };
  }
}