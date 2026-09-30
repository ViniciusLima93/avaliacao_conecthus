import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/config/database/database.module';
import { EnvModule } from './core/config/env/env.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [EnvModule, DatabaseModule, HealthModule, UserModule],
})
export class AppModule {}
