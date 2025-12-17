import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/enities/user.entity';
import { Notice } from 'src/common/enities/notice.entity';
import { Admin } from 'typeorm';
import Pusher from 'pusher';
import { PusherModule } from 'src/pusher/pusher.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notice]),
  PusherModule,
],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
