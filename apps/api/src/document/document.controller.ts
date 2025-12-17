import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  ForbiddenException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
    }),
  )
  async uploadDocument(
    @Body('seekerId') seekerId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new NotFoundException('File not provided');
    return await this.documentService.uploadDocument(seekerId, file);
  }

  @Get('me')
listMine(@Req() req: any) {
  const userId = req.user?.id ?? req.user?.sub;
  return this.documentService.listForSeeker(userId);
}

  @Get(':id/view')
  async viewDocument(
    @Param('id') documentId: string,
    @Body('counselorId') counselorId: string, // optional: could also use query
    @Res() res: Response,
  ) {
    if (!counselorId) throw new ForbiddenException('Counselor ID is required');

    const fileBuffer = await this.documentService.viewDocument(
      documentId,
      counselorId,
    );

    // send decrypted file as attachment
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${documentId}.pdf"`, // you can use original filename if stored
    });

    res.send(fileBuffer);
  }
}
