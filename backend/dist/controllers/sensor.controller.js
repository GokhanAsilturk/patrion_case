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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.publishSensorDataManually = exports.getSensorAnalytics = exports.getSensorTimeseriesData = void 0;
const sensor_model_1 = require("../models/sensor.model");
const log_model_1 = require("../models/log.model");
const log_1 = require("../types/log");
const influxdb_service_1 = require("../services/influxdb.service");
const date_utils_1 = require("../utils/date-utils");
const socket_1 = require("../socket");
/**
 * @swagger
 * /sensors/{sensorId}/timeseries:
 *   get:
 *     summary: Sensör zaman serisi verisi getirir
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensör ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Başlangıç tarihi (opsiyonel)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Bitiş tarihi (opsiyonel)
 *     responses:
 *       200:
 *         description: Sensör zaman serisi verisi başarıyla getirildi
 *       404:
 *         description: Sensör bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
const getSensorTimeseriesData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { sensorId } = req.params;
        // Sensörün var olup olmadığını kontrol et
        const sensor = yield (0, sensor_model_1.getSensorBySensorId)(sensorId);
        if (!sensor) {
            res.status(404).json({
                status: 'error',
                message: 'Sensör bulunamadı'
            });
            return;
        }
        // Zaman aralığı parametrelerini al ve işle
        const startDateStr = req.query.startDate;
        const endDateStr = req.query.endDate;
        // Varsayılan tarihler: son 24 saat
        const now = Math.floor(Date.now() / 1000); // Unix timestamp (saniye)
        const oneDayAgo = now - (24 * 60 * 60); // 24 saat öncesi
        // Eğer tarih parametreleri varsa, parse et
        let startTimestamp = oneDayAgo;
        let endTimestamp = now;
        if (startDateStr) {
            const startDate = (0, date_utils_1.parseLocalDate)(startDateStr);
            if (startDate) {
                startTimestamp = Math.floor(startDate.getTime() / 1000);
            }
        }
        if (endDateStr) {
            const endDate = (0, date_utils_1.parseLocalDate)(endDateStr);
            if (endDate) {
                // Günün sonunu kullan (23:59:59)
                endDate.setHours(23, 59, 59, 999);
                endTimestamp = Math.floor(endDate.getTime() / 1000);
            }
        }
        // InfluxDB'den zaman serisi verilerini sorgula
        const timeseriesData = yield (0, influxdb_service_1.querySensorData)(sensorId, startTimestamp, endTimestamp);
        // Log kaydı oluştur
        yield (0, log_model_1.createUserLog)({
            user_id: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0,
            action: log_1.LogAction.VIEWED_SENSOR_DATA,
            details: {
                sensor_id: sensorId,
                start_timestamp: startTimestamp,
                end_timestamp: endTimestamp
            },
            ip_address: req.ip
        });
        res.json({
            status: 'success',
            data: {
                sensor_id: sensorId,
                start_time: startTimestamp,
                end_time: endTimestamp,
                readings: timeseriesData
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Sensör verileri alınırken hata oluştu'
        });
    }
});
exports.getSensorTimeseriesData = getSensorTimeseriesData;
/**
 * @swagger
 * /sensors/{sensorId}/analytics:
 *   get:
 *     summary: Sensör analitik verisi getirir
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensör ID
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         description: Analiz edilecek alan
 *       - in: query *         name: window
 *         schema:
 *           type: string
 *           pattern: '^[0-9]+[hdwmy]$'
 *           example: '1h'
 *         description: |
 *           Zaman penceresi formatı. Örnek değerler:
 *             * 1h - 1 saat
 *             * 24h - 24 saat
 *             * 7d - 7 gün
 *             * 1w - 1 hafta
 *             * 1m - 1 ay
 *             * 1y - 1 yıl
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Başlangıç tarihi (opsiyonel)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Bitiş tarihi (opsiyonel)
 *     responses:
 *       200:
 *         description: Sensör analitik verisi başarıyla getirildi
 *       404:
 *         description: Sensör bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
const getSensorAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { sensorId } = req.params;
        const field = req.query.field;
        const window = req.query.window || '1h';
        if (!field) {
            res.status(400).json({
                status: 'error',
                message: 'Analiz edilecek alanı (field) belirtmelisiniz'
            });
            return;
        }
        // Sensörün var olup olmadığını kontrol et
        const sensor = yield (0, sensor_model_1.getSensorBySensorId)(sensorId);
        if (!sensor) {
            res.status(404).json({
                status: 'error',
                message: 'Sensör bulunamadı'
            });
            return;
        }
        // Zaman aralığı parametrelerini al ve işle
        const startDateStr = req.query.startDate;
        const endDateStr = req.query.endDate;
        // Varsayılan tarihler: son 24 saat
        const now = Math.floor(Date.now() / 1000); // Unix timestamp (saniye)
        const oneDayAgo = now - (24 * 60 * 60); // 24 saat öncesi
        // Eğer tarih parametreleri varsa, parse et
        let startTimestamp = oneDayAgo;
        let endTimestamp = now;
        if (startDateStr) {
            const startDate = (0, date_utils_1.parseLocalDate)(startDateStr);
            if (startDate) {
                startTimestamp = Math.floor(startDate.getTime() / 1000);
            }
        }
        if (endDateStr) {
            const endDate = (0, date_utils_1.parseLocalDate)(endDateStr);
            if (endDate) {
                // Günün sonunu kullan (23:59:59)
                endDate.setHours(23, 59, 59, 999);
                endTimestamp = Math.floor(endDate.getTime() / 1000);
            }
        }
        // InfluxDB'den analitik verileri sorgula
        const analyticsData = yield (0, influxdb_service_1.queryAggregatedData)(sensorId, field, window, startTimestamp, endTimestamp);
        // Log kaydı oluştur
        yield (0, log_model_1.createUserLog)({
            user_id: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0,
            action: log_1.LogAction.VIEWED_SENSOR_DATA,
            details: {
                sensor_id: sensorId,
                field,
                window,
                start_timestamp: startTimestamp,
                end_timestamp: endTimestamp
            },
            ip_address: req.ip
        });
        res.json({
            status: 'success',
            data: {
                sensor_id: sensorId,
                field,
                window,
                start_time: startTimestamp,
                end_time: endTimestamp,
                analytics: analyticsData
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Sensör analitik verileri alınırken hata oluştu'
        });
    }
});
exports.getSensorAnalytics = getSensorAnalytics;
/**
 * @swagger
 * /sensors/{sensorId}/publish:
 *   post:
 *     summary: Sensör verisi manuel yayınla
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensör ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               readings:
 *                 type: object
 *               companyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sensör verisi başarıyla yayınlandı
 *       404:
 *         description: Sensör bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
const publishSensorDataManually = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { sensorId } = req.params;
        const { readings, companyId } = req.body;
        if (!readings) {
            res.status(400).json({
                status: 'error',
                message: 'Sensör okuma verileri (readings) gereklidir'
            });
            return;
        }
        // Sensörün var olup olmadığını kontrol et
        const sensor = yield (0, sensor_model_1.getSensorBySensorId)(sensorId);
        if (!sensor) {
            res.status(404).json({
                status: 'error',
                message: 'Sensör bulunamadı'
            });
            return;
        }
        // Socket.IO ile veriyi yayınla
        const published = (0, socket_1.publishSensorData)(sensorId, Object.assign(Object.assign({}, readings), { timestamp: (_a = readings.timestamp) !== null && _a !== void 0 ? _a : new Date().toISOString() }), companyId !== null && companyId !== void 0 ? companyId : sensor.company_id);
        if (!published) {
            res.status(500).json({
                status: 'error',
                message: 'Socket.IO henüz başlatılmadı veya bağlantı problemi var'
            });
            return;
        }
        // Log kaydı oluştur
        yield (0, log_model_1.createUserLog)({
            user_id: (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : 0,
            action: log_1.LogAction.PUBLISHED_SENSOR_DATA,
            details: {
                sensor_id: sensorId,
                company_id: companyId !== null && companyId !== void 0 ? companyId : sensor.company_id,
                readings
            },
            ip_address: req.ip
        });
        res.json({
            status: 'success',
            message: 'Sensör verisi başarıyla yayınlandı',
            data: {
                sensor_id: sensorId,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Sensör verisi yayınlanırken hata oluştu'
        });
    }
});
exports.publishSensorDataManually = publishSensorDataManually;
/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Bildirim gönder
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetType:
 *                 type: string
 *                 enum: [company, sensor, all]
 *               targetId:
 *                 type: string
 *               notificationType:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bildirim başarıyla gönderildi
 *       400:
 *         description: Eksik bilgiler veya geçersiz targetType
 *       500:
 *         description: Sunucu hatası
 */
const sendNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { targetType, targetId, notificationType, message } = req.body;
        if (!targetType || !targetId || !notificationType) {
            res.status(400).json({
                status: 'error',
                message: 'Eksik bilgiler: targetType, targetId ve notificationType zorunludur'
            });
            return;
        }
        // Bildirim verisi oluştur
        const notificationData = {
            type: notificationType,
            message: message !== null && message !== void 0 ? message : 'Yeni bildirim',
            timestamp: new Date().toISOString(),
            senderId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        };
        // Socket.IO bağlantısı kontrolü
        if (!socket_1.io) {
            res.status(500).json({
                status: 'error',
                message: 'Socket.IO henüz başlatılmadı'
            });
            return;
        }
        // Hedef tipine göre odaya bildirim gönder
        if (targetType === 'company') {
            socket_1.io.to(`company_${targetId}`).emit('notification', notificationData);
        }
        else if (targetType === 'sensor') {
            socket_1.io.to(`sensor_${targetId}`).emit('notification', notificationData);
        }
        else if (targetType === 'all') {
            socket_1.io.emit('notification', notificationData);
        }
        else {
            res.status(400).json({
                status: 'error',
                message: 'Geçersiz targetType: company, sensor veya all olmalıdır'
            });
            return;
        }
        // Log kaydı oluştur
        yield (0, log_model_1.createUserLog)({
            user_id: (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : 0,
            action: log_1.LogAction.SENT_NOTIFICATION,
            details: {
                target_type: targetType,
                target_id: targetId,
                notification_type: notificationType,
                message
            },
            ip_address: req.ip
        });
        res.json({
            status: 'success',
            message: 'Bildirim başarıyla gönderildi',
            data: {
                target_type: targetType,
                target_id: targetId,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Bildirim gönderilirken hata oluştu'
        });
    }
});
exports.sendNotification = sendNotification;
