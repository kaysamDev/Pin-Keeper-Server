import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './models/auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { AuthService } from './models/auth/auth.service';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LocationsModule } from './locations/locations.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { LocationTagsModule } from './location-tags/location-tags.module';
import { CollectionsModule } from './collections/collections.module';
import { CollectionItemsModule } from './collection-items/collection-items.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ActivityLogsInterceptor } from './activity-logs/activity-logs.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    LocationsModule,
    CategoriesModule,
    TagsModule,
    LocationTagsModule,
    CollectionsModule,
    CollectionItemsModule,
    ActivityLogsModule,
  ],
  controllers: [AppController],
  providers: [
    AuthService,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogsInterceptor,
    },
  ],
  exports: [AuthService],
})
export class AppModule {}
