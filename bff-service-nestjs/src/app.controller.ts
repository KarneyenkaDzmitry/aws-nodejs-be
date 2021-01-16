import { Controller, All, Req, Res, UseFilters } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestService } from './app.service';

@Controller('*')
export class AppController {
  constructor(private readonly requestService: RequestService) { }

  @All()
  async handleAllRequests(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { service } = /^\/(?<service>.*?)\/.*$/i.exec(request.originalUrl).groups;
    let target = process.env[service];

    if (target) {
      target = request.originalUrl.replace(`/${service}`, target);
    } else {
      throw new Error('Unknown service exception');
    }
    console.log('Target url is: [%o]', target);
    // console.log('Method: [%o]', request.method);
    const { headers, status, data } = await this.requestService.exec(
      target,
      request.method,
      request.headers,
      request.body,
    );
    response.set(headers).status(status).send(data);
  }
}