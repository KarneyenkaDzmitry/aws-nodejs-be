import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors_middle from 'helmet';
import { config } from 'dotenv'
const { PORT = 8080 } = process.env;

config();

(async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // @ts-ignore
    origin: (req, callback) => callback(null, true),
  });
  app.use(cors_middle());
  await app.listen(PORT);
})();
