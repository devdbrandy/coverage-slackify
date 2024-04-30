import { CliOption } from './cli-options';
import { CoverageParser } from './coverage-parser';
import { GitInfo } from './git-info';
import { IstanbulReport } from './istanbul-report';
import { SlackNotifier } from './slack-notifier';
import { TextNotifier } from './text-notifier';
import { ReportDto } from './types/report-dto.type';

export class CoverageSlackifyCli {
  async execute() {
    try {
      const option = new CliOption();
      const istanbulReporter = new IstanbulReport(option.coverage);
      await istanbulReporter.generateSummary();

      const coverageParser = new CoverageParser(option);
      const coverageSummary = await coverageParser.processSummary();

      /**
       * TODO:
       * - Implement custom config via package.json
       */

      if (!process.env.SLACK_WEBHOOK) {
        const notifier = new TextNotifier();
        notifier.printCoverage(coverageSummary);
      } else {
        const gitInfo = new GitInfo();
        const commitInfo = await gitInfo.commitInfo();
        const reportDto: ReportDto = {
          projectName: 'coverage-slackify',
          coverage: coverageSummary,
          commitInfo,
        };
        const slackWebhook = process.env.SLACK_WEBHOOK;
        const notifier = new SlackNotifier(slackWebhook);
        const textPayload = notifier.buildCoverageBlock(reportDto);

        await notifier.sendNotification(textPayload);
      }

      process.exit(0);
    } catch (error: any) {
      console.error('Error executing coverage slack notification:');
      console.error('Error Message:', error.message);
      process.exit(1);
    }
  }
}
