import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RequestService {
  exec(url, method, headers, body) {
    return axios({
      method,
      url,
      headers: { ...headers, host: '' },
      data: method === 'GET' ? null : body,
    })
      .then(({ status, headers, data }) => ({ status, headers, data }))
      .catch((err) => {
        console.log('Request failure: [%o]', err.message);
        throw new Error(
          'Cross-request failure',
        );
      });
  }
}