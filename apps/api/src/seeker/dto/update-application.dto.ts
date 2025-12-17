// src/seeker/dto/update-application-status.dto.ts
import { IsEnum } from 'class-validator';
import { AppStatus } from '../entities/application.entity';
export class UpdateApplicationStatusDto {
  @IsEnum(AppStatus)
  status: AppStatus;
}
