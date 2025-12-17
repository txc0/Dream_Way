import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Doc } from 'src/common/enities/document.entity';
import { Consultation } from 'src/common/enities/consultation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doc, Consultation])],
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService], // optional if needed elsewhere
})
export class DocumentModule {}
