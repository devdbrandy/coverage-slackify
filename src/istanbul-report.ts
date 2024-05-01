import * as istanbul from 'istanbul';
import * as fs from 'fs';
import { CoverageOptions } from './types/config.type';

export class IstanbulReport {
  private readonly collector: istanbul.Collector;
  private readonly reporter: istanbul.Reporter;
  private readonly opts: CoverageOptions;

  constructor(options: CoverageOptions) {
    this.opts = options;
    this.collector = new istanbul.Collector();
    this.reporter = new istanbul.Reporter();
  }

  generateSummary() {
    const files = this.opts.coverageFiles.map(
      (file) => `${this.opts.rootDir}/${file}`
    );

    files.forEach((file) =>
      this.collector.add(JSON.parse(fs.readFileSync(file, 'utf8')))
    );

    // Generate the coverage summary report
    this.reporter.addAll(['json-summary']);
    this.reporter.write(this.collector, true, () => true);
  }
}
