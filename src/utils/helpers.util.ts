import * as fs from 'fs';

export function readPkg() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}
