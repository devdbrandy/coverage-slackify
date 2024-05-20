import { StatusType } from './status.type';

export type SlackNotifierConfig = {
  coverageStatus: SlackCoverageStatus;
};

export type SlackCoverageStatus = {
  [key in StatusType]: CoverageStatus;
};

export type CoverageStatus = {
  text: string;
  color: string;
  icon: string;
};
