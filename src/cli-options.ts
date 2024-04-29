import { OptionsType, CoverageOptions } from './types/config.type';

export class CliOption {
  opts: OptionsType;

  constructor(options?: OptionsType) {
    this.opts = options || this.defaultOptions;

    this.sanitizeThreshold(this.opts.coverage.threshold);

    if (this.opts.coverage.coverageFiles.length === 0) {
      throw new Error('Require at least one coverage istanbul file');
    }
  }

  private get defaultOptions(): OptionsType {
    return {
      projectName: '',
      coverage: {
        rootDir: '.',
        threshold: 80,
        coverageFiles: ['coverage/coverage-final.json'],
        coverageSummaryFile: 'coverage/coverage-summary.json',
      },
    };
  }

  private sanitizeThreshold(threshold: number) {
    if (threshold > 100) {
      this.opts.coverage.threshold = 100;
    } else if (threshold < 0) {
      this.opts.coverage.threshold = 0;
    }
  }

  get coverage(): CoverageOptions {
    return this.opts.coverage;
  }
}
