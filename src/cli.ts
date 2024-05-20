import { CliOption } from './cli-options';
import { CoverageParser } from './coverage-parser';
import { GitInfo } from './git-info';
import { IstanbulReport } from './istanbul-report';
import { SlackNotifier } from './slack-notifier';
import { TextNotifier } from './text-notifier';
import { ReportDto } from './types/report-dto.type';
import * as colorUtil from './utils/color.util';

export class CoverageSlackifyCli {
  private opts: CliOption;

  constructor(options: CliOption) {
    this.opts = options;
  }

  async execute() {
    try {
      const istanbulReporter = new IstanbulReport(this.opts.coverage);
      await istanbulReporter.generateSummary();

      const coverageParser = new CoverageParser(this.opts);
      const coverageSummary = await coverageParser.processSummary();

      if (this.opts.useTextNotify) {
        const notifier = new TextNotifier();
        notifier.printCoverage(coverageSummary);
      } else {
        const gitInfo = new GitInfo();
        const isGitInit = await gitInfo.verifyGit();
        const commitInfo = isGitInit ? await gitInfo.commitInfo() : null;

        const reportDto: ReportDto = {
          projectName: this.opts.projectName,
          coverage: coverageSummary,
          commitInfo,
        };
        const notifier = new SlackNotifier(this.opts.slack.webhook);
        const textPayload = notifier.buildCoverageBlock(reportDto);

        await notifier.sendNotification(textPayload);
      }

      process.exit(0);
    } catch (error: any) {
      console.error(
        colorUtil.error(
          '[coverage-slackify] Error executing coverage slack notify.'
        ),
        colorUtil.error(error?.message ?? '')
      );
      if (error.stderr) {
        console.error('[coverage-slackify] stderr:', error.stderr);
      }

      process.exit(1);
    }
  }
}
