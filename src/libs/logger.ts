import winston from 'winston';

const logFormat = winston.format.printf(function (info) {
  return `\n${new Date().toISOString()} ${info.level}: ${JSON.stringify(info.message, null, 4)}\n`;
});

export const logger = winston.createLogger({
  level: 'info',

  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
  ),

  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),

        logFormat,
      ),
    }),
  ],
});
