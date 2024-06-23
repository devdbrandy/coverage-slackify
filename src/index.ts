#!/usr/bin/env node

import { CoverageSlackifyCli } from './cli';
import { CliOption } from './cli-options';
import { readPkg } from './utils/helpers.util';

async function init() {
  const pkg = readPkg();
  const options = new CliOption(pkg);
  const cli = new CoverageSlackifyCli(options);

  await cli.execute();
}

init();
