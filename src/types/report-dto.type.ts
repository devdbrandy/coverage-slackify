import { Coverage } from './coverage.type';
import { CommitInfo } from './git-info.type';

export type ReportDto = {
  projectName: string | undefined;
  coverage: Coverage;
  commitInfo: CommitInfo;
};
