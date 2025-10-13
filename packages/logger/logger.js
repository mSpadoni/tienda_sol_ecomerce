import  winston from "winston";
import  path  from "path";
import { fileURLToPath } from "url";

// Variables para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { combine, timestamp, printf, colorize } = winston.format;

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    http: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    http: "blue",
    info: "green",
    debug: "magenta",
  },
};

winston.addColors(customLevels.colors);

const baseFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(
    ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`,
  ),
);

const consoleFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  colorize({ all: true }),
  printf(
    ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`,
  ),
);

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: "debug",
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "app.log"),
      format: baseFormat,
    }),
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

export default logger;
