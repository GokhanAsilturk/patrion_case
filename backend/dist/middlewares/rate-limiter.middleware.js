"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.highVolumeRateLimiter = exports.standardRateLimiter = exports.strictRateLimiter = exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("../utils/logger");
/**
 * API rate limiting middleware
 * Belirli bir IP adresinden gelen istekleri sınırlar
 * DDoS saldırılarına karşı koruma sağlar
 *
 * @param max Belirli bir zaman diliminde izin verilen maksimum istek sayısı
 * @param windowMs Zaman dilimi (milisaniye cinsinden)
 * @param message Rate limit aşıldığında gösterilecek hata mesajı
 * @returns Express middleware
 */
const rateLimiter = (max = 100, // 100 istek
windowMs = 15 * 60 * 1000, // 15 dakika
message = 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.') => {
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        message: {
            status: 'error',
            message
        },
        headers: true,
        // IP adresi yerine kullanıcı ID'si veya diğer kriterlere göre limitleme yapmak için keyGenerator fonksiyonu özelleştirilebilir
        keyGenerator: (req) => {
            return req.ip || 'unknown';
        },
        // Rate limit aşıldığında loglama
        handler: (req, res, next, options) => {
            logger_1.log.warn('Rate limit aşıldı', {
                ip: req.ip,
                method: req.method,
                url: req.originalUrl,
                userAgent: req.headers['user-agent']
            });
            res.status(429).json(options.message);
        }
    });
};
exports.rateLimiter = rateLimiter;
/**
 * Hassas API rotaları için daha sıkı rate limiting
 * Örneğin: kimlik doğrulama, şifre sıfırlama vb.
 */
exports.strictRateLimiter = (0, exports.rateLimiter)(20, // 20 istek
30 * 60 * 1000, // 30 dakika
'Hassas bir işlem için çok fazla deneme yaptınız. Güvenlik nedeniyle lütfen 30 dakika sonra tekrar deneyin.');
/**
 * Genel rotalar için standart rate limiting
 */
exports.standardRateLimiter = (0, exports.rateLimiter)();
/**
 * Sensor veri alımı gibi yüksek trafikli rotalar için yüksek limitli rate limiting
 */
exports.highVolumeRateLimiter = (0, exports.rateLimiter)(1000, // 1000 istek
60 * 1000, // 1 dakika
'Çok fazla veri isteği gönderdiniz. Lütfen 1 dakika sonra tekrar deneyin.');
