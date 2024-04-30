import SlackNotify, { SlackNotify as SlackNotifyClient } from 'slack-notify';

import { ReportDto } from './types/report-dto.type';
import { SlackNotifierConfig } from './types/slack.type';
import { StatusType } from './types/status.type';

export class SlackNotifier {
  private client: SlackNotifyClient;
  private config: SlackNotifierConfig;

  constructor(slackWebhookUrl: string) {
    if (!slackWebhookUrl) {
      throw new Error('Slack webhook url is required');
    }

    this.config = {
      thresholdOpts: {
        pass: { text: 'passed', color: '#36a64f', icon: ':thumbsup:' },
        fail: { text: 'failed', color: '#dc5547', icon: ':thumbsdown:' },
      },
    };
    this.client = SlackNotify(slackWebhookUrl);
  }

  getThresholdConfig(status: StatusType) {
    return this.config.thresholdOpts[status];
  }

  buildCoverageBlock(dto: ReportDto) {
    if (!dto.coverage) {
      throw new Error('No coverage and/or build data provided');
    }

    const { coverage, commitInfo } = dto;
    const threshold = coverage.success
      ? this.getThresholdConfig('pass')
      : this.getThresholdConfig('fail');
    const commitRef = commitInfo.refs[1] || commitInfo.refs[0];

    const payload = {
      attachments: [
        {
          color: threshold.color,
          title: `${dto.projectName} - coverage check ${threshold.text}`,
          fallback: `${dto.projectName} - coverage check ${threshold.text} at ${coverage.coveragePercentage}%`,
          fields: [
            {
              title: 'Total Coverage',
              value: `${coverage.coveragePercentage}%`,
              short: true,
            },
            {
              title: 'Threshold',
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
          footer: `Added by Coverage Slackify • ${commitInfo.author} committed ${commitInfo.shortRevision} ${commitRef}`,
          footer_icon:
            'https://emoji.slack-edge.com/T071CEN0CCR/robo/6fac99bd09670ff4.png',
          ts: commitInfo.date,
        },
      ],
    };

    return payload;
  }

  async sendNotification(payload: any) {
    if (!payload) {
      throw new Error('No slack payload provided');
    }

    await this.client.send(payload);
  }
}
