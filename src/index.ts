#!/usr/bin/env node
import { CoverageSlackifyCli } from './cli';

async function init() {
  const cli = new CoverageSlackifyCli();
  await cli.execute();
}

init();
