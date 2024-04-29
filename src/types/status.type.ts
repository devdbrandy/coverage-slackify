export type StatusType = 'pass' | 'fail';

export type StatusEmojis = {
  [key in StatusType]: string[];
};
