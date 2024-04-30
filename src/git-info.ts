import { exec } from 'child_process';
import { CommitInfo } from './types/git-info.type';

const LOG_SEPARATOR = '§§';

export class GitInfo {
  commitInfo(): Promise<CommitInfo> {
    return new Promise((resolve, reject) => {
      exec(this.logInfoCommand(), (err, stdout, stderr) => {
        if (err) {
          const error = new Error('Failed to retrieve Git log info');
          err.stderr = stderr;
          reject(error);
          return;
        }

        const commitData = this.extractLogData(stdout);
        resolve(commitData);
      });
    });
  }

  private logInfoCommand() {
    const gitFormat = ['%h', '%H', '%at', '%s', '%an', '%ae', '%d'].join(
      LOG_SEPARATOR
    );
    return `git log -1 --pretty=format:'${gitFormat}'
    `;
  }

  private extractLogData(log: string): CommitInfo {
    const logData = log.split(LOG_SEPARATOR);
    return {
      shortRevision: logData[0],
      commitHash: logData[1],
      date: logData[2],
      subject: logData[3],
      author: logData[4],
      authorEmail: logData[5],
      refs: this.normalizeRefs(logData[6]),
    };
  }

  private normalizeRefs(rawData: string) {
    const data = rawData.trim().replace('(', '').replace(')', '').split(', ');
    data[0] = data[0].split(' -> ')[1];
    return data;
  }
}
