import 'fastify'
import 'express-session'

declare module 'fastify' {
  interface FastifyRequest {
    session: import('express-session').Session & Partial<Record<string, any>>
  }
}