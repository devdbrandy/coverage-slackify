#!/usr/bin/env node
import { CoverageSlackifyCli } from './cli';

function init() {
  try {
    const cli = new CoverageSlackifyCli();
    cli.execute();
  } catch (error) {
    console.error('Failure running coverage slackify');
  }
}

init();
