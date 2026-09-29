/*
 * Název souboru:    main.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Vstupní bod aplikace. Vytváří instanci NestJS aplikace,
 *                   povoluje CORS a spouští server na portu 3000.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
