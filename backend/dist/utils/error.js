"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = exports.BusinessError = exports.MqttError = exports.InfluxDbError = exports.SensorError = exports.DatabaseError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
const error_1 = require("../types/error");
const logger_1 = require("./logger");
class AppError extends Error {
    constructor(message, errorCode = error_1.ErrorCode.UNKNOWN_ERROR, details, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.errorCode = errorCode;
        this.statusCode = error_1.HTTP_STATUS_CODES[errorCode];
        this.details = details;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
        this.logError();
    }
    logError() {
        logger_1.log.error(`[${this.errorCode}] ${this.message}`, {
            error: {
                name: this.name,
                code: this.errorCode,
                statusCode: this.statusCode,
                message: this.message,
                stack: this.stack,
                details: this.details
            }
        });
    }
    toJSON() {
        return {
            status: 'error',
            code: this.errorCode,
            message: this.message,
            details: this.details
        };
    }
}
exports.AppError = AppError;
/**
 * Validasyon hatası
 */
class ValidationError extends AppError {
    constructor(message, details) {
        super(message, error_1.ErrorCode.VALIDATION_ERROR, details);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
/**
 * Kimlik doğrulama hatası
 */
class AuthenticationError extends AppError {
    constructor(message, errorCode = error_1.ErrorCode.UNAUTHORIZED, details) {
        super(message, errorCode, details);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
/**
 * Yetkilendirme hatası
 */
class AuthorizationError extends AppError {
    constructor(message, details) {
        super(message, error_1.ErrorCode.FORBIDDEN, details);
        this.name = 'AuthorizationError';
    }
}
exports.AuthorizationError = AuthorizationError;
/**
 * Bulunamadı hatası
 */
class NotFoundError extends AppError {
    constructor(message, details) {
        super(message, error_1.ErrorCode.NOT_FOUND, details);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Veritabanı hatası
 */
class DatabaseError extends AppError {
    constructor(message, errorCode = error_1.ErrorCode.DB_QUERY_ERROR, details) {
        super(message, errorCode, details);
        this.name = 'DatabaseError';
    }
}
exports.DatabaseError = DatabaseError;
/**
 * Sensör hatası
 */
class SensorError extends AppError {
    constructor(message, errorCode = error_1.ErrorCode.SENSOR_DATA_INVALID, details) {
        super(message, errorCode, details);
        this.name = 'SensorError';
    }
}
exports.SensorError = SensorError;
/**
 * InfluxDB hatası
 */
class InfluxDbError extends AppError {
    constructor(message, errorCode = error_1.ErrorCode.INFLUXDB_QUERY_ERROR, details) {
        super(message, errorCode, details);
        this.name = 'InfluxDbError';
    }
}
exports.InfluxDbError = InfluxDbError;
/**
 * MQTT hatası
 */
class MqttError extends AppError {
    constructor(message, errorCode = error_1.ErrorCode.MQTT_CONNECTION_ERROR, details) {
        super(message, errorCode, details);
        this.name = 'MqttError';
    }
}
exports.MqttError = MqttError;
/**
 * İş mantığı hatası
 */
class BusinessError extends AppError {
    constructor(message, errorCode = error_1.ErrorCode.BUSINESS_RULE_VIOLATION, details) {
        super(message, errorCode, details);
        this.name = 'BusinessError';
    }
}
exports.BusinessError = BusinessError;
/**
 * Hata mesajları
 */
exports.ErrorMessages = {
    UNAUTHORIZED: 'Bu işlem için yetkiniz bulunmamaktadır',
    INVALID_CREDENTIALS: 'Geçersiz kullanıcı adı veya şifre',
    TOKEN_EXPIRED: 'Oturum süresi doldu, lütfen yeniden giriş yapın',
    TOKEN_INVALID: 'Geçersiz veya bozuk token',
    FORBIDDEN: 'Bu kaynağa erişim izniniz yok',
    NOT_FOUND: 'İstenen kaynak bulunamadı',
    USER_NOT_FOUND: 'Kullanıcı bulunamadı',
    USER_ALREADY_EXISTS: 'Bu email adresi zaten kayıtlı',
    SENSOR_NOT_FOUND: 'Sensör bulunamadı',
    INVALID_REQUEST: 'Geçersiz istek',
    VALIDATION_ERROR: 'Giriş verileri doğrulanamadı'
};
