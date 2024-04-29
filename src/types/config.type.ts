export interface OptionsType {
  projectName: string;
  coverage: CoverageOptions;
}

export type CoverageOptions = {
  rootDir: string;
  threshold: number;
  coverageFiles: string[];
  coverageSummaryFile: string;
};
