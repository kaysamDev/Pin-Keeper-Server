import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './models/auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { AuthService } from './models/auth/auth.service';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [AuthService, AppService],
  exports: [AuthService],
})
export class AppModule {}
