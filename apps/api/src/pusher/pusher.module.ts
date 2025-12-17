import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PusherService } from './pusher.service';

@Module({
  imports: [ConfigModule],
  providers: [PusherService],
  exports: [PusherService],
})
export class PusherModule {}
