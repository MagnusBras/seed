import { describe, it, expect } from 'vitest';
import { HelloService } from './hello.service';

describe('HelloService', () => {
  const service = new HelloService();

  it('retorna um objeto com a propriedade code', () => {
    const result = service.getHello();
    expect(result).toHaveProperty('code');
  });

  it('code tem exatamente 6 dígitos', () => {
    const { code } = service.getHello();
    expect(typeof code).toBe('string');
    expect(code).toHaveLength(6);
    expect(/^\d{6}$/.test(code)).toBe(true);
  });

  it('code está no intervalo 000000–999999', () => {
    const num = parseInt(service.getHello().code, 10);
    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThanOrEqual(999_999);
  });

  it('chamadas consecutivas geram valores distintos (probabilístico)', () => {
    const codes = new Set(Array.from({ length: 20 }, () => service.getHello().code));
    expect(codes.size).toBeGreaterThan(1);
  });
});
