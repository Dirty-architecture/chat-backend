import { ConfigService } from '@nestjs/config';
import {FastifyPluginOptions, FastifyRegisterOptions} from "fastify";

export class CorsConfig {
  static create(configService: ConfigService): FastifyRegisterOptions<FastifyPluginOptions> {
    const raw = configService.get<string>('ALLOWED_ORIGIN') ?? '';
    const allowedFromEnv = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const fallbackDev = ['http://localhost:5173', 'http://127.0.0.1:5173'];
    const allowed = allowedFromEnv.length ? allowedFromEnv : fallbackDev;

    return {
      origin: (origin, cb) => {
        // запросы без Origin (curl, сервер-сервер) — пропускаем
        if (!origin) return cb(null, true);

        const ok = allowed.includes(origin);
        return cb(null, ok);
      },
      credentials: true,
      exposedHeaders: ['set-cookie'],
    };
  }
}