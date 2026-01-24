import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import {IS_DEV_ENV} from '@/shared'
import {AuthModule, PrismaModule, UserModule} from "@/modules";

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({
		  ignoreEnvFile: !IS_DEV_ENV,
		  isGlobal: true
	  }),
  ],
})
export class AppModule {}
