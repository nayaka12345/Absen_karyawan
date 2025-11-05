import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- PERBAIKAN KONFIGURASI CORS DI SINI ---
  app.enableCors({
    origin: 'http://localhost:3000', // Izinkan frontend Anda
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Izinkan semua method standar
    credentials: true, // Izinkan pengiriman cookie/token
    allowedHeaders: 'Content-Type, Accept, Authorization', // Izinkan header yang umum digunakan
  });
  // --- END PERBAIKAN ---

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT || 3232);
  console.log(`🚀 Server running on http://localhost:3232`);
}
bootstrap();