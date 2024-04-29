import { CoverageParser } from './coverage-parser';
import { SlackNotifier } from './slack-notifier';
import { TextNotifier } from './text-notifier';

export class CoverageSlackifyCli {
  async execute() {
    try {
      const coverageParser = new CoverageParser();
      const coverageSummary = await coverageParser.processSummary();

      /**
       * TODO:
       * - Implement git commit info
       * - Implement custom config via package.json
       */

      if (!process.env.SLACK_WEBHOOK) {
        const notifier = new TextNotifier();
        notifier.printCoverage(coverageSummary);
      } else {
        const slackWebhook = process.env.SLACK_WEBHOOK;
        const notifier = new SlackNotifier(slackWebhook);
        const slackBlock = notifier.buildCoverageBlock(coverageSummary);
        await notifier.sendNotification(slackBlock);
      }

      process.exit(0);
    } catch (error) {
      console.error('Error executing coverage slack notification:\n', error);
      process.exit(1);
    }
  }
}
