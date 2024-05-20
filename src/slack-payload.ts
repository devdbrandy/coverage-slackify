import { CommitInfo } from './types/git-info.type';
import { ReportDto } from './types/report-dto.type';
import { CoverageStatus } from './types/slack.type';

export class SlackPayload {
  private reportDto: ReportDto;
  private coverageStatus: CoverageStatus;

  constructor(dto: ReportDto, coverageStatus: CoverageStatus) {
    this.reportDto = dto;
    this.coverageStatus = coverageStatus;
  }

  private createSection(title: string, percentage: number) {
    return {
      title,
      value: `${percentage}% \n${this.renderProgressBar(percentage)}`,
      short: true,
    };
  }

  private getFooter(commitInfo: CommitInfo | null) {
    const caption = 'Added by Coverage Slackify';
    if (!commitInfo) {
      return caption;
    }

    return `${caption} • ${commitInfo.author} committed ${commitInfo.shortRevision}`;
  }

  private renderProgressBar(percentage: number) {
    const filledBars = Math.round(percentage / 10);
    const emptyBars = 10 - filledBars;

    let filledEmoji;
    if (percentage < 50) {
      filledEmoji = '🟥';
    } else if (percentage < 80) {
      filledEmoji = '🟨';
    } else {
      filledEmoji = '🟩';
    }

    return `${filledEmoji.repeat(filledBars)}${'⬜'.repeat(emptyBars)}`;
  }

  composePayload() {
    const { coverage, commitInfo, projectName } = this.reportDto;
    const isFullCoverage = coverage.totalCoverage === 100;
    const statusIcon = isFullCoverage ? ':100:' : this.coverageStatus.icon;

    return {
      attachments: [
        {
          color: this.coverageStatus.color,
          title: `${projectName} - coverage check ${this.coverageStatus.text} ${statusIcon}`,
          fallback: `${projectName} - coverage check ${this.coverageStatus.text} at ${coverage.totalCoverage}%`,
          fields: [
            this.createSection('Total Coverage', coverage.totalCoverage),
            this.createSection('Threshold :dart:', coverage.threshold),
            this.createSection('Statements', coverage.statements),
            this.createSection('Functions / Methods', coverage.functions),
            this.createSection('Branches', coverage.branches),
            this.createSection('Lines', coverage.lines),
          ],
          footer: this.getFooter(commitInfo),
          footer_icon:
            'https://emoji.slack-edge.com/T071CEN0CCR/robo/6fac99bd09670ff4.png',
          ts: commitInfo?.date,
        },
      ],
    };
  }
}
