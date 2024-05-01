import * as fs from 'fs';

export function readPackageJson() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}
