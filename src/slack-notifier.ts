import SlackNotify, { SlackNotify as SlackClient } from 'slack-notify';
import { SlackPayload } from './slack-payload';

import { ReportDto } from './types/report-dto.type';
import { SlackNotifierConfig } from './types/slack.type';
import { StatusType } from './types/status.type';

export class SlackNotifier {
  private readonly client: SlackClient;
  private readonly config: SlackNotifierConfig;

  constructor(webhookUrl: string | undefined) {
    if (!webhookUrl) {
      throw new Error('Slack webhook url is required');
    }

    this.config = {
      coverageStatus: {
        pass: { text: 'passed', color: '#36a64f', icon: ':white_check_mark:' },
        fail: { text: 'failed', color: '#dc5547', icon: ':x:' },
      },
    };
    this.client = SlackNotify(webhookUrl);
  }

  getCoverageStatus(status: StatusType) {
    return this.config.coverageStatus[status];
  }

  buildCoverageBlock(dto: ReportDto) {
    if (!dto.coverage) {
      throw new Error('No coverage or build data provided');
    }

    const status = dto.coverage.success ? 'pass' : 'fail';
    const coverageStatus = this.getCoverageStatus(status);
    const slackPayload = new SlackPayload(dto, coverageStatus);

    return slackPayload.composePayload();
  }

  async sendNotification(payload: any) {
    if (!payload) {
      throw new Error('No slack payload provided');
    }

    await this.client.send(payload);
  }
}
