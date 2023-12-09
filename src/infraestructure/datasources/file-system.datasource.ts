import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import fs from 'fs';
export class FileSystemDataSource implements LogDatasource {

    private readonly logPath: string = 'logs/';
    private readonly allLogPath: string = 'logs/logs-all.log';
    private readonly mediumLogPath: string = 'logs/logs-medium.log';
    private readonly highLogPath: string = 'logs/logs-high.log';

    constructor() { this.createLogFiles(); }


    private createLogFiles() {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath);
        }

        [this.allLogPath, this.mediumLogPath, this.highLogPath].forEach(path => {
            if (!fs.existsSync(path)) {
                fs.writeFileSync(path, '');
            }
        })
    }

    async saveLog(newLog: LogEntity): Promise<void> {
        const logAsJson = `${JSON.stringify(newLog)}\n`;
        fs.appendFileSync(this.allLogPath, logAsJson);
        if (newLog.level === LogSeverityLevel.low) return;
        if (newLog.level === LogSeverityLevel.medium) {
            fs.appendFileSync(this.mediumLogPath, logAsJson);
        } else {
            fs.appendFileSync(this.highLogPath, logAsJson);
        }
    }

    private getLogFromFile(path: string): LogEntity[] {
        const content = fs.readFileSync(path, 'utf8');
        if (content === '') return [];
        return content.split('\n').map(LogEntity.fromJson);
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        switch (severityLevel) {
            case LogSeverityLevel.low:
                return this.getLogFromFile(this.allLogPath);
            case LogSeverityLevel.medium:
                return this.getLogFromFile(this.mediumLogPath);
            case LogSeverityLevel.high:
                return this.getLogFromFile (this.highLogPath);
            default:
                throw new Error(`${severityLevel} is not a valid severity level`);
        }
    }

}