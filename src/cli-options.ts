import {
  OptionsType,
  CoverageOptions,
  SlackOptions,
} from './types/config.type';

export class CliOption {
  private readonly config: OptionsType;

  constructor(options: { name: string; coverageSlackify: OptionsType }) {
    this.config = Object.assign(this.defaultOpts, {});
    this.sanitizeConfig(options?.coverageSlackify, options?.name);
  }

  private get defaultOpts(): OptionsType {
    return {
      projectName: process.env.npm_package_name,
      coverage: {
        rootDir: '.',
        coverageFiles: ['coverage/coverage-final.json'],
        coverageSummaryFile: 'coverage/coverage-summary.json',
        threshold: 100,
      },
      slack: {
        webhook: process.env.SLACK_WEBHOOK,
      },
      useTextNotify: !process.env.SLACK_WEBHOOK,
    };
  }

  sanitizeConfig(coverageSlackify: OptionsType, packageName: string) {
    this.config.coverage.rootDir =
      coverageSlackify?.coverage?.rootDir ||
      this.defaultOpts?.coverage?.rootDir;
    this.config.coverage.threshold =
      coverageSlackify?.coverage?.threshold ||
      this.defaultOpts?.coverage?.threshold;
    this.config.coverage.coverageFiles =
      coverageSlackify?.coverage?.coverageFiles ||
      this.defaultOpts?.coverage?.coverageFiles;
    this.config.coverage.coverageSummaryFile =
      coverageSlackify?.coverage?.coverageSummaryFile ||
      this.defaultOpts?.coverage?.coverageSummaryFile;
    this.config.projectName =
      coverageSlackify?.projectName ||
      this.defaultOpts?.projectName ||
      packageName;

    this.sanitizeThreshold(this.config.coverage.threshold);

    if (this.config.coverage.coverageFiles.length === 0) {
      throw new Error('Require at least one coverage istanbul file');
    }
  }

  private sanitizeThreshold(threshold: number) {
    if (threshold > 100) {
      this.config.coverage.threshold = 100;
    } else if (threshold < 0) {
      this.config.coverage.threshold = 0;
    }
  }

  get projectName(): string | undefined {
    return this.config.projectName;
  }

  get coverage(): CoverageOptions {
    return this.config.coverage;
  }

  get slack(): SlackOptions {
    return this.config.slack;
  }

  get useTextNotify(): boolean {
    return this.config.useTextNotify;
  }
}
