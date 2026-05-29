import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class HelloService {
  getHello(): { code: string } {
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    return { code };
  }
}
