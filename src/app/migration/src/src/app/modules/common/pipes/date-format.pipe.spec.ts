

import { DateFormatPipe } from './date-format.pipe';
import * as moment from 'moment';

describe('DateFormatPipe', () => {
  describe('#transform', () => {
    it('should properly format a date', () => {
      const pipe = new DateFormatPipe();
      const result = pipe.transform(moment('2016-01-24 01:23:45'));
      expect(result).toBe('24th January 2016');
    });

  });
});
