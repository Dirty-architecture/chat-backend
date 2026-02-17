import { ConfigService } from '@nestjs/config';
import {FastifyPluginOptions, FastifyRegisterOptions} from "fastify";

export class CorsConfig {
  static create(configService: ConfigService): FastifyRegisterOptions<FastifyPluginOptions> {
    const raw = configService.get<string>('ALLOWED_ORIGIN') ?? '';
    const allowedFromEnv = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const allowLocalDev = new Set(['http://localhost:5173', 'http://127.0.0.1:5173']);
    const envExact = new Set(allowedFromEnv);

    const isTunaHostname = (hostname: string) =>
      hostname === 'tuna.am' || hostname.endsWith('.tuna.am');

    return {
      origin: (origin, cb) => {
        // запросы без Origin (curl, сервер-сервер) — пропускаем
        if (!origin) return cb(null, true);

        // 1) точечный allowlist из env (если используете)
        if (envExact.has(origin)) return cb(null, true);

        // 2) localhost для дев-режима
        if (allowLocalDev.has(origin)) return cb(null, true);

        // 3) универсально для Tuna
        try {
          const { hostname } = new URL(origin);
          if (isTunaHostname(hostname)) return cb(null, true);
        } catch {
          // origin не URL — запрещаем
        }

        return cb(null, false);
      },
      credentials: true,
      exposedHeaders: ['set-cookie'],
    };
  }
}