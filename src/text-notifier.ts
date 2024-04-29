import { emojis } from './emojis';
import { Coverage } from './types/coverage.type';
import { StatusEmojis, StatusType } from './types/status.type';
import {
  successBold,
  success,
  successUnderline,
  infoBold,
  info,
  errorUnderline,
  error,
  rainbow,
} from './utils/color.util';

export class TextNotifier {
  private emojis: StatusEmojis;

  constructor() {
    this.emojis = emojis;
  }

  getEmoji(status: StatusType) {
    const emojis = this.emojis[status];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  printCoverage(data: Coverage) {
    if (!data) {
      throw new Error('Coverage information missing');
    }

    const { coveragePercentage, threshold } = data;

    if (data.success) {
      const emoji = this.getEmoji('pass');
      console.log(
        successBold('Total Coverage:'),
        success(`${coveragePercentage}%`),
        successBold('\tRequired Coverage:'),
        success(`${threshold}%`)
      );
      console.log(
        successUnderline('Coverage Check Passed'),
        rainbow(`\t${emoji}`)
      );
    } else {
      const emoji = this.getEmoji('fail');
      console.log(
        infoBold('Total Coverage:'),
        info(`${coveragePercentage}%`),
        infoBold('\tRequired Coverage:'),
        info(`${threshold}%`)
      );
      console.log(errorUnderline('Coverage Check Failed'), error(`\t${emoji}`));
    }
  }
}
