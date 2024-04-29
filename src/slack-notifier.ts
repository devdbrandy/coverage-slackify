import SlackNotify, { SlackNotify as SlackNotifyClient } from 'slack-notify';

import { Coverage } from './types/coverage.type';
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

  buildCoverageBlock(coverage: Coverage) {
    if (!coverage) {
      throw new Error('No coverage and/or build data provided');
    }

    const threshold = coverage.success
      ? this.getThresholdConfig('pass')
      : this.getThresholdConfig('fail');

    /**
     * TODO:
     * - Add more details to slack message block (git info)
     * - Improve message block
     */

    const payload = {
      icon_emoji: threshold.icon,
      attachments: [
        {
          color: threshold.color,
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
