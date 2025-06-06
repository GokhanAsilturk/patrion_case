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
exports.startServer = exports.closeServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("./config/config"));
const routes_1 = __importDefault(require("./routes"));
const mqtt_service_1 = require("./services/mqtt.service");
const socket_1 = require("./socket");
const user_model_1 = require("./models/user.model");
const company_model_1 = require("./models/company.model");
const sensor_model_1 = require("./models/sensor.model");
const log_model_1 = require("./models/log.model");
const logger_middleware_1 = require("./middlewares/logger.middleware");
const logger_1 = require("./utils/logger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const seed_1 = __importDefault(require("./seeds/seed"));
const rate_limiter_middleware_1 = require("./middlewares/rate-limiter.middleware");
const influxdb_service_1 = require("./services/influxdb.service");
// Hata yakalama middleware'lerini içe aktar
const error_middleware_1 = require("./middlewares/error.middleware");
// Environment variables
dotenv_1.default.config();
// Express uygulaması
const app = (0, express_1.default)();
const PORT = config_1.default.port;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// HTTP request logger
app.use(logger_middleware_1.httpLogger);
// Global rate limiter - tüm API'ler için
app.use(rate_limiter_middleware_1.standardRateLimiter);
// Initialize database tables with retry mechanism
const initDatabase = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (retries = 3, delay = 3000) {
    let attempts = 0;
    // Table creation retry loop
    while (attempts < retries) {
        try {
            logger_1.log.info(`Veritabanı tablolarını oluşturma denemesi: ${attempts + 1}/${retries}`);
            // İlk önce şirket tablosunu oluştur (users tablosu company_id foreign key için buna bağlı)
            yield (0, company_model_1.createCompaniesTable)();
            logger_1.log.info('Şirket tablosu başarıyla oluşturuldu');
            // Sonra kullanıcı tablosunu oluştur (bu tabloda company_id foreign key'i var)
            yield (0, user_model_1.createUsersTable)();
            logger_1.log.info('Kullanıcı tablosu başarıyla oluşturuldu');
            // Sensör tablolarını oluştur
            yield (0, sensor_model_1.createSensorsTable)();
            logger_1.log.info('Sensör tablosu başarıyla oluşturuldu');
            yield (0, sensor_model_1.createSensorDataTable)();
            logger_1.log.info('Sensör veri tablosu başarıyla oluşturuldu');
            // Son olarak log tablosunu oluştur
            yield (0, log_model_1.createUserLogsTable)();
            logger_1.log.info('Kullanıcı log tablosu başarıyla oluşturuldu');
            logger_1.log.info('Veritabanı tabloları başarıyla oluşturuldu');
            break; // Başarılı olunca döngüden çık
        }
        catch (error) {
            attempts++;
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.log.error('Veritabanı tabloları oluşturulurken hata', {
                error: errorMessage,
                attempt: attempts,
                remainingRetries: retries - attempts
            });
            console.error(`Veritabanı hata (Deneme ${attempts}/${retries}):`, errorMessage);
            if (attempts >= retries) {
                logger_1.log.error('Maksimum yeniden deneme sayısına ulaşıldı, tablo oluşturma başarısız');
                break;
            }
            logger_1.log.info(`${delay / 1000} saniye sonra tablolar yeniden oluşturulmayı deneyecek...`);
            yield new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    // Seed data retry loop - separate from table creation
    attempts = 0;
    while (attempts < retries) {
        try {
            logger_1.log.info(`Seed verilerini ekleme denemesi: ${attempts + 1}/${retries}`);
            yield (0, seed_1.default)();
            logger_1.log.info('Seed verileri başarıyla eklendi');
            break; // Başarılı olunca döngüden çık
        }
        catch (error) {
            attempts++;
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.log.error('Seed verileri ekleme hatası', {
                error: errorMessage,
                attempt: attempts,
                remainingRetries: retries - attempts
            });
            console.error(`Seed verileri ekleme hatası (Deneme ${attempts}/${retries}):`, errorMessage);
            if (attempts >= retries) {
                logger_1.log.error('Maksimum yeniden deneme sayısına ulaşıldı, seed verileri ekleme başarısız');
                break;
            }
            logger_1.log.info(`${delay / 1000} saniye sonra seed verileri yeniden eklenmeyi deneyecek...`);
            yield new Promise(resolve => setTimeout(resolve, delay));
        }
    }
});
// API Routes
app.use('/api', routes_1.default);
console.log('API rotaları yüklendi, /api/logs endpoint\'i aktif');
// Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.default);
});
// Ana sayfa
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
// Hata yakalama middleware'leri
// 404 handler - rotalardan sonra eklenir
app.use(error_middleware_1.notFoundHandler);
// Express hata middleware'leri 4 parametre alır (err, req, res, next)
app.use(error_middleware_1.validationErrorHandler);
app.use(error_middleware_1.postgresErrorHandler);
app.use(error_middleware_1.jwtErrorHandler);
app.use(error_middleware_1.unexpectedErrorHandler);
// Global error handler - en son çalışacak
app.use(error_middleware_1.globalErrorHandler);
// HTTP server
const server = http_1.default.createServer(app);
// Initialize Socket.IO
(0, socket_1.initSocketIO)(server);
// Sunucuyu kapatmak için fonksiyon
const closeServer = () => {
    if (server) {
        server.close();
    }
};
exports.closeServer = closeServer;
// Sunucuyu başlatmak için fonksiyon
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.log.info(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
            // Initialize database tables
            yield initDatabase();
            // Initialize MQTT client
            (0, mqtt_service_1.initMqttClient)();
            // Initialize InfluxDB client
            (0, influxdb_service_1.initInfluxDB)();
            resolve();
        }));
    });
});
exports.startServer = startServer;
// Test ortamında değilsek sunucuyu başlat
if (process.env.NODE_ENV !== 'test') {
    (0, exports.startServer)();
}
// Handle process termination
process.on('SIGTERM', () => {
    logger_1.log.info('SIGTERM sinyali alındı. Sunucu kapatılıyor.');
    server.close(() => {
        logger_1.log.info('HTTP sunucusu kapatıldı.');
        process.exit(0);
    });
});
exports.default = server;
