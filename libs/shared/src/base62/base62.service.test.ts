import { Base62Service } from '@app/shared/base62/base62.service';

describe('Base62Service', () => {
  let service: Base62Service;
  beforeEach(() => {
    service = new Base62Service();
  });
  describe('encode', () => {
    const testCases = [
      [1, '002VMtIK'],
      [2, '002u11fD'],
      [3, '001pOpKf'],
      [4, '0031dYNL'],
      [5, '003iWeU7'],
      [6, '0003J4WA'],
      [7, '001RxXtG'],
      [8, '003q8FNk'],
      [9, '0046l8Qi'],
      [10, '000bDbb0'],
      [100, '00055l18'],
    ] as const;

    it.each(testCases)('should generate 8-character code for ID $0', (input, output) => {
      const code = service.encode(input);

      expect(code).toHaveLength(8);
      expect(code).toBe(output);
      expect(code).not.toBe(input.toString().padStart(8, '0'));
    });

    it('should always produce the same output for the same input', () => {
      const firstCall = service.encode(500);
      const secondCall = service.encode(500);

      expect(firstCall).toBe(secondCall);
    });

    it('should never produce the same code for different IDs', () => {
      const codes = new Set();
      for (let i = 1; i <= 1000; i++) {
        codes.add(service.encode(i));
      }
      expect(codes.size).toBe(1000);
    });
  });
});
