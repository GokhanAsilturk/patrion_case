"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sensor_controller_1 = require("../controllers/sensor.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rate_limiter_middleware_1 = require("../middlewares/rate-limiter.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /sensors:
 *   get:
 *     summary: Tüm sensörleri getirir
 *     description: Sistemdeki tüm sensörlerin listesini veritabanından çeker
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sensörler başarıyla getirildi
 *       401:
 *         description: Kimlik doğrulama hatası
 *       500:
 *         description: Sunucu hatası
 */
router.get('/', auth_middleware_1.authenticate, rate_limiter_middleware_1.standardRateLimiter, sensor_controller_1.getSensors);
/**
 * @swagger
 * /sensors/{sensorId}/timeseries:
 *   get:
 *     summary: Belirli bir sensörün zaman serisi verilerini getirir
 *     description: Belirli bir zaman aralığında sensör verilerini InfluxDB'den çeker
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: "Sensör ID"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: "Başlangıç tarihi (Format - GG/AA/YYYY)"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: "Bitiş tarihi (Format - GG/AA/YYYY)"
 *     responses:
 *       200:
 *         description: Sensör zaman serisi verileri başarıyla getirildi
 *       401:
 *         description: Kimlik doğrulama hatası
 *       404:
 *         description: Sensör bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.get('/:sensorId/timeseries', auth_middleware_1.authenticate, rate_limiter_middleware_1.standardRateLimiter, sensor_controller_1.getSensorTimeseriesData);
/**
 * @swagger
 * /sensors/{sensorId}/analytics:
 *   get:
 *     summary: Belirli bir sensörün analitik verilerini getirir
 *     description: Belirli bir zaman aralığında sensör verilerinin istatistiğini çıkarır
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: "Sensör ID"
 *       - in: query
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *         description: "Analiz edilecek alan (örn. temperature, humidity)"
 *       - in: query
 *         name: window
 *         schema:
 *           type: string
 *           default: 1h
 *         description: "Zaman penceresi (örn. 15m, 1h, 1d)"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: "Başlangıç tarihi (Format - GG/AA/YYYY)"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: "Bitiş tarihi (Format - GG/AA/YYYY)"
 *     responses:
 *       200:
 *         description: Sensör analitik verileri başarıyla getirildi
 *       401:
 *         description: Kimlik doğrulama hatası
 *       404:
 *         description: Sensör bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.get('/:sensorId/analytics', auth_middleware_1.authenticate, rate_limiter_middleware_1.standardRateLimiter, sensor_controller_1.getSensorAnalytics);
/**
 * @swagger
 * /sensors/{sensorId}/publish:
 *   post:
 *     summary: Manuel olarak sensör verisi yayınlar
 *     description: WebSocket üzerinden belirli bir sensör için veri yayınlar
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: "Sensör ID"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - readings
 *             properties:
 *               readings:
 *                 type: object
 *                 description: "Sensör okuma verileri"
 *               companyId:
 *                 type: string
 *                 description: "İsteğe bağlı şirket ID"
 *     responses:
 *       200:
 *         description: Sensör verisi başarıyla yayınlandı
 *       400:
 *         description: Geçersiz istek formatı
 *       401:
 *         description: Kimlik doğrulama hatası
 *       404:
 *         description: Sensör bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.post('/:sensorId/publish', auth_middleware_1.authenticate, rate_limiter_middleware_1.standardRateLimiter, sensor_controller_1.publishSensorDataManually);
/**
 * @swagger
 * /sensors/notifications:
 *   post:
 *     summary: WebSocket üzerinden bildirim gönderir
 *     description: Belirli bir hedef tipine (şirket, sensör, tümü) bildirim gönderir
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetType
 *               - targetId
 *               - notificationType
 *             properties:
 *               targetType:
 *                 type: string
 *                 enum: [company, sensor, all]
 *                 description: "Bildirim hedef tipi"
 *               targetId:
 *                 type: string
 *                 description: "Hedef ID (targetType all ise gerekli değil)"
 *               notificationType:
 *                 type: string
 *                 description: "Bildirim tipi (alert, info, warning, success)"
 *               message:
 *                 type: string
 *                 description: "Bildirim mesajı"
 *     responses:
 *       200:
 *         description: Bildirim başarıyla gönderildi
 *       400:
 *         description: Geçersiz istek formatı
 *       401:
 *         description: Kimlik doğrulama hatası
 *       500:
 *         description: Sunucu hatası
 */
router.post('/notifications', auth_middleware_1.authenticate, rate_limiter_middleware_1.standardRateLimiter, sensor_controller_1.sendNotification);
exports.default = router;
