export interface OptionsType {
  projectName: string | undefined;
  coverage: CoverageOptions;
  slack: SlackOptions;
  useTextNotify: boolean;
}

export type CoverageOptions = {
  rootDir: string;
  threshold: number;
  coverageFiles: string[];
  coverageSummaryFile: string;
};

export type SlackOptions = {
  webhook: string | undefined;
};
