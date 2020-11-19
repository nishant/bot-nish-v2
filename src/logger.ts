import { Logger } from 'tslog';

/* log levels available: silly | trace | debug | info | warn | error | fatal */
const formatAsJson: boolean = false;

export const logger: Logger = formatAsJson
  ? new Logger({ type: 'json' })
  : new Logger();

export interface LoggerInput {
  action: string;
  author: string;
  content: string;
}
export const log = () => {
  logger.info();
};
