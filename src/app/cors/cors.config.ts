import { ConfigService } from '@nestjs/config';
import {FastifyPluginOptions, FastifyRegisterOptions} from "fastify";

export class CorsConfig {
  static create(configService: ConfigService): FastifyRegisterOptions<FastifyPluginOptions> {
    return {
      origin: configService.getOrThrow<string>('ALLOWED_ORIGIN'),
      credentials: true,
      exposedHeaders: ['set-cookie'],
    };
  }
}