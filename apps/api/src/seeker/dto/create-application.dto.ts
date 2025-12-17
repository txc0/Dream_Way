// src/seeker/dto/create-application.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
export class CreateApplicationDto {
  @IsUUID() @IsNotEmpty()
  programId: string;

  @IsOptional() @IsString()
  note?: string;
}
