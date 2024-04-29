import fs from 'fs';
import { Coverage, CoverageSummary } from './types/coverage.type';

type Config = {
  rootDir: string;
  threshold: number;
  coverageFiles: string[];
  coverageSummaryFile: string;
};

export class CoverageParser {
  private config: Config;

  constructor(config?: Config) {
    this.config = config || {
      rootDir: '.',
      threshold: 80,
      coverageFiles: ['coverage/coverage-final.json'],
      coverageSummaryFile: 'coverage/coverage-summary.json',
    };
    this.sanitizeThreshold(this.config.threshold);

    if (this.config.coverageFiles.length === 0) {
      throw new Error('Require at least one coverage istanbul file');
    }
  }

  get coverageFiles(): string[] {
    return this.config.coverageFiles;
  }

  private sanitizeThreshold(threshold: number) {
    if (threshold > 100) {
      this.config.threshold = 100;
    } else if (threshold < 0) {
      this.config.threshold = 0;
    }
  }

  async processSummary(): Promise<Coverage> {
    const { total: totalSummary } = await this.readCoverageSummary();
    const coverage: Coverage = {
      branches: totalSummary.branches.pct,
      functions: totalSummary.functions.pct,
      lines: totalSummary.lines.pct,
      statements: totalSummary.statements.pct,
      threshold: this.config.threshold,
    };

    coverage.coveragePercentage = this.calcCoveragePercentage(coverage);
    coverage.success = this.config.threshold <= coverage.coveragePercentage;
    return coverage;
  }

  async readCoverageSummary(): Promise<CoverageSummary> {
    const coverageSummary = `${this.config.rootDir}/${this.config.coverageSummaryFile}`;
    return new Promise((resolve, reject) => {
      fs.readFile(coverageSummary, 'utf-8', (err, data) => {
        if (err) {
          reject(
            new Error(
              `Error processing file: ${this.config.coverageSummaryFile}`
            )
          );
        }
        resolve(JSON.parse(data));
      });
    });
  }

  private calcCoveragePercentage(coverage: Coverage) {
    const coveragePct =
      (coverage.branches +
        coverage.functions +
        coverage.lines +
        coverage.statements) /
      4;

    return parseFloat(coveragePct.toFixed(2));
  }
}
