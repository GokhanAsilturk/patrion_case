"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logDir = 'logs';
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'patrion-sensor-service' },
    transports: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});
logger.exceptions.handle(new winston_1.default.transports.File({
    filename: path_1.default.join(logDir, 'exceptions.log'),
    maxsize: 5242880,
    maxFiles: 5,
}));
logger.rejections.handle(new winston_1.default.transports.File({
    filename: path_1.default.join(logDir, 'rejections.log'),
    maxsize: 5242880,
    maxFiles: 5,
}));
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
    }));
}
exports.log = {
    error: (message, meta = {}) => {
        logger.error(message, { metadata: meta });
    },
    warn: (message, meta = {}) => {
        logger.warn(message, { metadata: meta });
    },
    info: (message, meta = {}) => {
        logger.info(message, { metadata: meta });
    },
    debug: (message, meta = {}) => {
        logger.debug(message, { metadata: meta });
    },
    http: (req, res, responseTime) => {
        var _a;
        const logLevel = res.statusCode >= 400 ? 'error' : 'info';
        logger[logLevel]('HTTP İsteği', {
            metadata: {
                method: req.method,
                url: req.url,
                status: res.statusCode,
                responseTime: `${responseTime}ms`,
                userAgent: req.headers['user-agent'],
                ip: req.ip,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            }
        });
    },
    db: (query, params, duration) => {
        logger.debug('Veritabanı Sorgusu', {
            metadata: {
                query,
                params,
                duration: `${duration}ms`
            }
        });
    },
    sensor: (sensorId, data) => {
        logger.info('Sensör Verisi', {
            metadata: {
                sensorId,
                data
            }
        });
    }
};
exports.default = logger;
