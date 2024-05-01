import { CliOption } from './cli-options';
import { CoverageParser } from './coverage-parser';
import { GitInfo } from './git-info';
import { IstanbulReport } from './istanbul-report';
import { SlackNotifier } from './slack-notifier';
import { TextNotifier } from './text-notifier';
import { ReportDto } from './types/report-dto.type';
import { readPackageJson } from './utils/helpers.util';

export class CoverageSlackifyCli {
  async execute() {
    try {
      const packageJson = readPackageJson();
      const option = new CliOption(packageJson);

      const istanbulReporter = new IstanbulReport(option.coverage);
      await istanbulReporter.generateSummary();

      const coverageParser = new CoverageParser(option);
      const coverageSummary = await coverageParser.processSummary();

      if (option.useTextNotify) {
        const notifier = new TextNotifier();
        notifier.printCoverage(coverageSummary);
      } else {
        const gitInfo = new GitInfo();
        const isGitInit = await gitInfo.verifyGit();
        const commitInfo = isGitInit ? await gitInfo.commitInfo() : null;

        const reportDto: ReportDto = {
          projectName: option.projectName,
          coverage: coverageSummary,
          commitInfo,
        };
        const notifier = new SlackNotifier(option.slack.webhook);
        const textPayload = notifier.buildCoverageBlock(reportDto);

        await notifier.sendNotification(textPayload);
      }

      process.exit(0);
    } catch (error: any) {
      console.error('Error executing coverage slack notification:');
      console.error('Error Message:', error.message);
      if (error.stderr) {
        console.error('stderr:', error.stderr);
      }
      process.exit(1);
    }
  }
}
