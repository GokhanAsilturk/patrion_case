"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("./config"));
const logger_1 = require("../utils/logger");
const pool = new pg_1.Pool({
    host: config_1.default.db.host,
    port: config_1.default.db.port,
    user: config_1.default.db.user,
    password: config_1.default.db.password,
    database: config_1.default.db.database,
    client_encoding: 'UTF8'
});
// Bağlantıda hata olursa tüm uygulamayı çökertmek yerine loglama yap
pool.on('error', (err) => {
    logger_1.log.error('Beklenmeyen veritabanı hatası', { error: err.message });
});
// Test connection with retries
const testConnection = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (retries = 5, delay = 5000) {
    let client;
    let attempts = 0;
    while (attempts < retries) {
        try {
            client = yield pool.connect();
            const result = yield client.query('SELECT NOW()');
            logger_1.log.info('Veritabanı bağlantısı başarılı', {
                timestamp: result.rows[0],
                attempt: attempts + 1
            });
            return true;
        }
        catch (err) {
            attempts++;
            const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
            logger_1.log.error('Veritabanına bağlanırken hata oluştu', {
                error: errorMessage,
                attempt: attempts,
                remainingRetries: retries - attempts
            });
            if (attempts >= retries) {
                logger_1.log.error('Maksimum yeniden deneme sayısına ulaşıldı, veritabanı bağlantısı başarısız', {
                    totalAttempts: attempts
                });
                return false;
            }
            logger_1.log.info(`${delay / 1000} saniye sonra yeniden bağlanmayı deneyecek...`);
            yield new Promise(resolve => setTimeout(resolve, delay));
        }
        finally {
            if (client)
                client.release();
        }
    }
    return false;
});
// Bağlantıyı test et - 5 deneme ve 5 saniye aralıkla
testConnection(5, 5000);
exports.default = pool;
