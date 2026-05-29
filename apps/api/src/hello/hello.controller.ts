import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { HelloService } from './hello.service';

@ApiTags('hello')
@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna um código aleatório de 6 dígitos' })
  @ApiOkResponse({ schema: { example: { code: '042891' } } })
  getHello(): { code: string } {
    return this.helloService.getHello();
  }
}
