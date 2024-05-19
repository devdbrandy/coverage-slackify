import SlackNotify, { SlackNotify as SlackNotifyClient } from 'slack-notify';

import { CommitInfo } from './types/git-info.type';
import { ReportDto } from './types/report-dto.type';
import { SlackNotifierConfig } from './types/slack.type';
import { StatusType } from './types/status.type';

export class SlackNotifier {
  private readonly client: SlackNotifyClient;
  private readonly config: SlackNotifierConfig;

  constructor(webhookUrl: string | undefined) {
    if (!webhookUrl) {
      throw new Error('Slack webhook url is required');
    }

    this.config = {
      thresholdOpts: {
        pass: { text: 'passed', color: '#36a64f', icon: ':white_check_mark:' },
        fail: { text: 'failed', color: '#dc5547', icon: ':x:' },
      },
    };
    this.client = SlackNotify(webhookUrl);
  }

  getThresholdConfig(status: StatusType) {
    return this.config.thresholdOpts[status];
  }

  buildCoverageBlock(dto: ReportDto) {
    if (!dto.coverage) {
      throw new Error('No coverage or build data provided');
    }

    const { coverage, commitInfo } = dto;
    const threshold = coverage.success
      ? this.getThresholdConfig('pass')
      : this.getThresholdConfig('fail');

    const payload = {
      attachments: [
        {
          color: threshold.color,
          title: `${dto.projectName} - coverage check ${threshold.text} ${threshold.icon}`,
          fallback: `${dto.projectName} - coverage check ${threshold.text} at ${coverage.totalCoverage}%`,
          fields: [
            {
              title: 'Total Coverage',
              value: `${coverage.totalCoverage}%`,
              short: true,
            },
            {
              title: 'Threshold :dart:',
              value: `${coverage.threshold}%`,
              short: true,
            },
            {
              title: 'Statements',
              value: `${coverage.statements}%`,
              short: true,
            },
            {
              title: 'Functions / Methods',
              value: `${coverage.functions}%`,
              short: true,
            },
            {
              title: 'Branches',
              value: `${coverage.branches}%`,
              short: true,
            },
            {
              title: 'Lines',
              value: `${coverage.lines}%`,
              short: true,
            },
          ],
          footer: this.getFooter(commitInfo),
          footer_icon:
            'https://emoji.slack-edge.com/T071CEN0CCR/robo/6fac99bd09670ff4.png',
          ts: commitInfo?.date,
        },
      ],
    };

    return payload;
  }

  private getFooter(commitInfo: CommitInfo | null) {
    const caption = 'Added by Coverage Slackify';
    if (!commitInfo) {
      return caption;
    }

    const commitRef = commitInfo?.refs[1] || commitInfo?.refs[0];
    return `${caption} • ${commitInfo.author} committed ${commitInfo.shortRevision} ${commitRef}`;
  }

  async sendNotification(payload: any) {
    if (!payload) {
      throw new Error('No slack payload provided');
    }

    await this.client.send(payload);
  }
}
