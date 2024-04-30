import { Coverage } from './coverage.type';
import { CommitInfo } from './git-info.type';

export type ReportDto = {
  projectName: string;
  coverage: Coverage;
  commitInfo: CommitInfo;
};
