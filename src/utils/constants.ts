import { lowerCase } from 'lodash';

export const ROOT_DIR = require.main === module ? require.main.filename : '.';
export const PORT = parseInt(process.env.PORT, 10);
export const ESB_ENVIRONMENT = process.env.ESB_ENVIRONMENT || 'HOMOLOGACAO';
export const IS_DEV = process.env.NODE_ENV !== 'production';
export const DEFAULT_TIMEOUT = 20 * 1000; // 20 segundos
export const LOG_LEVEL = lowerCase(process.env.LOG_LEVEL) || 'info';
export const LOG_DIR = process.env.LOG_DIR || ROOT_DIR;
