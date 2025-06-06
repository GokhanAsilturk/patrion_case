"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.jwtErrorHandler = exports.unexpectedErrorHandler = exports.postgresErrorHandler = exports.validationErrorHandler = exports.notFoundHandler = void 0;
const error_1 = require("../utils/error");
const error_2 = require("../types/error");
const logger_1 = require("../utils/logger");
const express_validator_1 = require("express-validator");
/**
 * 404 hata yakalama
 */
const notFoundHandler = (req, res, next) => {
    const err = new error_1.AppError(`${req.originalUrl} adresi bulunamadı`, error_2.ErrorCode.NOT_FOUND);
    next(err);
};
exports.notFoundHandler = notFoundHandler;
/**
 * Validasyon hata yakalama
 */
const validationErrorHandler = (err, req, res, next) => {
    if (err instanceof express_validator_1.Result && err.array) {
        return res.status(400).json({
            status: 'error',
            code: error_2.ErrorCode.VALIDATION_ERROR,
            message: 'Validasyon hatası',
            errors: err.array()
        });
    }
    next(err);
};
exports.validationErrorHandler = validationErrorHandler;
/**
 * PostgreSQL hata yakalama
 */
const postgresErrorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    // Duplicate key hatasını kontrol et (PostgreSQL error code 23505)
    if (err.code === '23505') {
        const message = 'Yinelenen veri hatası';
        error = new error_1.AppError(message, error_2.ErrorCode.DUPLICATE_ENTRY);
        return next(error);
    }
    // Foreign key ihlali (PostgreSQL error code 23503)
    if (err.code === '23503') {
        const message = 'İlişkisel veri hatası';
        error = new error_1.AppError(message, error_2.ErrorCode.FOREIGN_KEY_VIOLATION);
        return next(error);
    }
    // Tablo bulunamadı hatası (PostgreSQL error code 42P01)
    if (err.code === '42P01') {
        const message = 'Veritabanı tablo hatası';
        error = new error_1.AppError(message, error_2.ErrorCode.DB_QUERY_ERROR);
        return next(error);
    }
    next(err);
};
exports.postgresErrorHandler = postgresErrorHandler;
/**
 * Beklenmeyen hata yakalama
 */
const unexpectedErrorHandler = (err, req, res, next) => {
    // Operasyonel olmayan hatalar için process.exit(1) düşünülebilir
    if (err instanceof error_1.AppError && !err.isOperational) {
        logger_1.log.error('KRITIK HATA: İşlemsel olmayan hata yakalandı!', {
            error: err.message,
            stack: err.stack
        });
        // Geliştirme ortamında hatanın tam detaylarını göster
        if (process.env.NODE_ENV === 'development') {
            return res.status(500).json({
                status: 'error',
                message: err.message,
                stack: err.stack,
                error: err
            });
        }
        // Üretim ortamında genel hata mesajı göster
        return res.status(500).json({
            status: 'error',
            message: 'Bir şeyler yanlış gitti! Lütfen daha sonra tekrar deneyin.'
        });
    }
    next(err);
};
exports.unexpectedErrorHandler = unexpectedErrorHandler;
/**
 * JWT hata yakalama
 */
const jwtErrorHandler = (err, req, res, next) => {
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            code: error_2.ErrorCode.TOKEN_INVALID,
            message: 'Geçersiz token. Lütfen tekrar giriş yapın.'
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            code: error_2.ErrorCode.TOKEN_EXPIRED,
            message: 'Token süresi doldu. Lütfen tekrar giriş yapın.'
        });
    }
    next(err);
};
exports.jwtErrorHandler = jwtErrorHandler;
/**
 * Genel hata işleme
 */
const globalErrorHandler = (err, req, res, _next) => {
    // AppError sınıfımızdan bir hata mı?
    if (err instanceof error_1.AppError) {
        return res.status(err.statusCode).json(err.toJSON());
    }
    // Bilinmeyen hata - Genel hata
    const statusCode = err.statusCode || error_2.HTTP_STATUS_CODES[error_2.ErrorCode.UNKNOWN_ERROR];
    const errorCode = err.errorCode || error_2.ErrorCode.UNKNOWN_ERROR;
    logger_1.log.error('Beklenmeyen hata', {
        error: err.message || 'Bilinmeyen hata',
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body
    });
    res.status(statusCode).json({
        status: 'error',
        code: errorCode,
        message: err.message || 'Bir hata oluştu'
    });
};
exports.globalErrorHandler = globalErrorHandler;
