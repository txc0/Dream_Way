import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { Doc } from 'src/common/enities/document.entity';
import { Consultation, Status } from 'src/common/enities/consultation.entity';
import { once } from 'events';

const ENCRYPTION_KEY = crypto.randomBytes(32); // Replace with your secure key
const IV_LENGTH = 16;

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Doc)
    private readonly docRepo: Repository<Doc>,
    @InjectRepository(Consultation)
    private readonly consultationRepo: Repository<Consultation>,
  ) {}


  async uploadDocument(
    seekerId: string,
    file: Express.Multer.File,
  ): Promise<Doc> {
    // Encrypt the file
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const input = fs.createReadStream(file.path);
    const encryptedFilePath = path.join('uploads', `${file.filename}.enc`);
    const output = fs.createWriteStream(encryptedFilePath);

    input.pipe(cipher).pipe(output);

    await once(output, 'finish');

    const doc = this.docRepo.create({
      fileName: file.originalname,
      filePath: encryptedFilePath,
      updatedAt: new Date(),
      encrypted: true,
      seeker: { id: seekerId } as any,
    });

    return await this.docRepo.save(doc);
  }

  // ---------------------------
  // 2. View document
  // ---------------------------
  async viewDocument(documentId: string, counselorId: string): Promise<Buffer> {
    const doc = await this.docRepo.findOne({
      where: { id: documentId },
      relations: ['seeker'],
    });

    if (!doc) throw new NotFoundException('Document not found');

    // Check if the counselor has an accepted consultation with the seeker
    const consultation = await this.consultationRepo.findOne({
      where: {
        counselor: { id: counselorId },
        seeker: { id: doc.seeker.id },
        status: Status.ACCEPTED,
      },
    });

    if (!consultation) throw new ForbiddenException('Access denied');

    const encryptedData = fs.readFileSync(doc.filePath);
    const iv = encryptedData.subarray(0, IV_LENGTH);
    const encryptedText = encryptedData.subarray(IV_LENGTH);

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decrypted;
  }
listForSeeker(seekerId: string) {
  return this.docRepo.find({
    where: { seeker: { id: seekerId } },
    order: { updatedAt: 'DESC' },
  });
}

}
