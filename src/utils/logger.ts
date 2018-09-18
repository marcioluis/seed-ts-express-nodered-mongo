import { keys, omit, size, upperCase } from 'lodash';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { IS_DEV, LOG_DIR, LOG_LEVEL } from './constants';
import { Utils } from './utils';

const errorTransport = new transports.DailyRotateFile({
	level: 'error',
	dirname: `${LOG_DIR}/logs`,
	filename: 'error-%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '7d'
});

const transport = new transports.DailyRotateFile({
	dirname: `${LOG_DIR}/logs`,
	filename: 'server-%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '7d'
});

export const Logger = createLogger({
	level: LOG_LEVEL,
	format: format.combine(
		format.timestamp(),
		format.splat(),
		format.simple(),
		format.printf(
			(info) =>
				`${info.timestamp}\t[${upperCase(info.level)}]\t${info.message || 'NO MESSAGE'}${
				size(keys(omit(info, ['level', 'timestamp', 'message']))) > 0
					? `\t${Utils.stringify(omit(info, ['level', 'timestamp', 'message']))}`
					: ''
				}`
		)
	),
	transports: [errorTransport, transport]
});

// If we're not in production then log to the `console` with the format:
if (IS_DEV) {
	Logger.add(new transports.Console());
}
