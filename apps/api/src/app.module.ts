import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './hello/hello.module';
import { DrizzleModule } from './db/drizzle.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    HelloModule,
    ClientsModule,
  ],
})
export class AppModule {}
