export type Coverage = {
  branches: number;
  functions: number;
  lines: number;
  statements: number;
  threshold: number;
  totalCoverage?: number;
  success?: boolean;
};

export type CoverageSummary = {
  total: CoverageReport;
  [key: string]: CoverageReport;
};

export type CoverageReport = {
  lines: CoverageStat;
  statements: CoverageStat;
  functions: CoverageStat;
  branches: CoverageStat;
};

export type CoverageStat = {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
  linesCovered: { [key: string]: number };
};
