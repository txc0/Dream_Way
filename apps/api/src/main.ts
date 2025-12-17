import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3002',
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
