import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import {PrismaClient} from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const pool = new PrismaPg({ connectionString: process.env.POSTGRES_URI! });
    super({ adapter: pool });
  }

	public async onModuleInit(): Promise<void> {
		await this.$connect()
	}

	public async onModuleDestroy(): Promise<void> {
		void this.$disconnect
	}
}
