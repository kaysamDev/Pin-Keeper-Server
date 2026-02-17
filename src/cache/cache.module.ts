import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 60000, // 60 seconds default TTL
      max: 1000, // max items in cache
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
