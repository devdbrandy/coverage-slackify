import { StatusType } from './status.type';

export type SlackNotifierConfig = {
  threshold: SlackConfigResult;
};

export type SlackConfigResult = {
  [key in StatusType]: {
    text: string;
    color: string;
    icon: string;
  };
};
