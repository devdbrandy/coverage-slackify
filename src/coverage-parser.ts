import * as fs from 'fs';
import { CliOption } from './cli-options';
import { CoverageOptions } from './types/config.type';
import { Coverage, CoverageSummary } from './types/coverage.type';

export class CoverageParser {
  private cliOption: CliOption;

  constructor(option: CliOption) {
    this.cliOption = option;
  }

  get coverageOpts(): CoverageOptions {
    return this.cliOption.coverage;
  }

  get coverageFiles(): string[] {
    return this.coverageOpts.coverageFiles;
  }

  async processSummary(): Promise<Coverage> {
    const { total: totalSummary } = await this.readCoverageSummary();
    const coverage: Coverage = {
      branches: totalSummary.branches.pct,
      functions: totalSummary.functions.pct,
      lines: totalSummary.lines.pct,
      statements: totalSummary.statements.pct,
      threshold: this.coverageOpts.threshold,
    };

    coverage.coveragePercentage = this.calcCoveragePercentage(coverage);
    coverage.success =
      this.coverageOpts.threshold <= coverage.coveragePercentage;
    return coverage;
  }

  async readCoverageSummary(): Promise<CoverageSummary> {
    const coverageSummary = `${this.coverageOpts.rootDir}/${this.coverageOpts.coverageSummaryFile}`;
    return new Promise((resolve, reject) => {
      fs.readFile(coverageSummary, 'utf8', (err, data) => {
        if (err) {
          reject(
            new Error(
              `Error processing file: ${this.coverageOpts.coverageSummaryFile}`
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
