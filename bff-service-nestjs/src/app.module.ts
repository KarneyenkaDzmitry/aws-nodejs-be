import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RequestService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RequestService],
})
export class AppModule { }
