import {
  OptionsType,
  CoverageOptions,
  SlackOptions,
  PackageJsonSchema,
} from './types/config.type';

export class CliOption {
  private readonly opts: OptionsType;

  constructor(pkg: PackageJsonSchema) {
    this.opts = Object.assign(this.defaultOpts, {});
    this.sanitizeConfig(pkg);
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

  private sanitizeConfig(pkg: PackageJsonSchema) {
    const { coverageSlackify } = pkg;

    this.opts.coverage.threshold =
      coverageSlackify?.threshold || this.defaultOpts.coverage.threshold;
    this.opts.coverage.coverageFiles =
      coverageSlackify?.coverageFiles ||
      this.defaultOpts.coverage.coverageFiles;
    this.opts.projectName =
      coverageSlackify?.projectName ||
      this.defaultOpts?.projectName ||
      pkg?.name;

    this.sanitizeThreshold(this.opts.coverage.threshold);

    if (this.opts.coverage.coverageFiles.length === 0) {
      throw new Error('Require at least one coverage istanbul file');
    }
  }

  private sanitizeThreshold(threshold: number) {
    if (threshold > 100) {
      this.opts.coverage.threshold = 100;
    } else if (threshold < 0) {
      this.opts.coverage.threshold = 0;
    }
  }

  get projectName(): string | undefined {
    return this.opts.projectName;
  }

  get coverage(): CoverageOptions {
    return this.opts.coverage;
  }

  get slack(): SlackOptions {
    return this.opts.slack;
  }

  get useTextNotify(): boolean {
    return this.opts.useTextNotify;
  }
}
