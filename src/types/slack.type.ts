import { StatusType } from './status.type';

export type SlackNotifierConfig = {
  thresholdOpts: SlackOptionResult;
};

export type SlackOptionResult = {
  [key in StatusType]: {
    text: string;
    color: string;
    icon: string;
  };
};
