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
exports.getUserActivityStats = exports.getLogsAnalytics = exports.getLogsByAction = exports.getUserLogs = void 0;
const log_model_1 = require("../models/log.model");
const log_1 = require("../types/log");
const user_1 = require("../types/user");
const database_1 = __importDefault(require("../config/database"));
const date_utils_1 = require("../utils/date-utils");
// Hata sınıflarını içe aktar
const error_1 = require("../utils/error");
const error_2 = require("../types/error");
/**
 * @swagger
 * /logs/users/{userId}:
 *   get:
 *     summary: Belirli bir kullanıcının log kayıtlarını getirir
 *     description: Kullanıcıya ait tüm log kayıtlarını listeler. System Admin tüm logları, Company Admin kendi şirketindeki kullanıcıların loglarını, User ise sadece kendi loglarını görebilir.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Logları görüntülenecek kullanıcının ID'si
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Bir sayfada gösterilecek log sayısı
 *     responses:
 *       200:
 *         description: Kullanıcı logları başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserLog'
 *       401:
 *         description: Kimlik doğrulama hatası
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
/**
 * @swagger
 * /logs/my-logs:
 *   get:
 *     summary: Kendi log kayıtlarını getirir
 *     description: Oturum açmış kullanıcının kendi log kayıtlarını listeler. Her kullanıcı kendi loglarını görüntüleme hakkına sahiptir.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Bir sayfada gösterilecek log sayısı
 *     responses:
 *       200:
 *         description: Kullanıcı logları başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserLog'
 *       401:
 *         description: Kimlik doğrulama hatası
 *       500:
 *         description: Sunucu hatası
 */
const getUserLogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Eğer userId params'tan gelmiyorsa, oturum açmış kullanıcının id'sini kullan
        const userId = parseInt(req.params.userId, 10) || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        // Tarih filtresi için parametreleri al
        const startDateStr = req.query.startDate;
        const endDateStr = req.query.endDate;
        // Eğer tarih parametreleri varsa, parse et
        const startDate = startDateStr ? (0, date_utils_1.parseLocalDate)(startDateStr) : null;
        const endDate = endDateStr ? (0, date_utils_1.parseLocalDate)(endDateStr) : null;
        // Geçersiz tarih formatı kontrolü
        if ((startDateStr && !startDate) || (endDateStr && !endDate)) {
            throw new error_1.ValidationError('Geçersiz tarih formatı. Lütfen GG/AA/YYYY formatında tarih girin (örn: 16/05/2025)');
        }
        // Erişim kontrolü
        if (userRole !== user_1.UserRole.SYSTEM_ADMIN && ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) !== userId) {
            // Şirket yöneticileri için şirket bazlı erişim kontrolü ek olarak yapılabilir
            if (userRole === user_1.UserRole.COMPANY_ADMIN) {
                // Bu kısım, şirket kontrolü gerektiren bir sorgu eklenecek
                // Şirket yöneticisi, şirketindeki kullanıcıların loglarını görebilmeli
            }
            else {
                throw new error_1.AuthorizationError('Bu kullanıcının log kayıtlarına erişim yetkiniz bulunmamaktadır');
            }
        }
        yield (0, log_model_1.createUserLog)({
            user_id: ((_d = req.user) === null || _d === void 0 ? void 0 : _d.id) || 0,
            action: log_1.LogAction.VIEWED_LOGS,
            details: {
                target_user_id: userId,
                start_date: startDateStr,
                end_date: endDateStr
            },
            ip_address: req.ip
        });
        // Tarih filtresi içeren sorguyu oluştur
        let query = `
      SELECT id, user_id, action, details, ip_address, timestamp, created_at as "createdAt"
      FROM user_logs
      WHERE user_id = $1
    `;
        const queryParams = [userId];
        if (startDate) {
            query += ` AND timestamp >= $${queryParams.length + 1}`;
            queryParams.push(startDate.toISOString());
        }
        if (endDate) {
            // Bitiş tarihine 1 gün ekleyerek tam günü kapsayacak şekilde filtreleme
            const nextDay = new Date(endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query += ` AND timestamp < $${queryParams.length + 1}`;
            queryParams.push(nextDay.toISOString());
        }
        query += ` ORDER BY timestamp DESC`;
        // Sayfalama için parametreleri al
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        // Sayfalama ekle
        query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);
        // Sorguyu çalıştır
        const { rows } = yield database_1.default.query(query, queryParams).catch(err => {
            throw new error_1.DatabaseError(`Veritabanı sorgulama hatası: ${err.message}`, error_2.ErrorCode.DB_QUERY_ERROR, { query });
        });
        // Toplam kayıt sayısını al
        const countQuery = `
      SELECT COUNT(*) FROM user_logs 
      WHERE user_id = $1
      ${startDate ? ' AND timestamp >= $2' : ''}
      ${endDate ? ` AND timestamp < $${startDate ? 3 : 2}` : ''}
    `;
        const countParams = [userId];
        if (startDate)
            countParams.push(startDate.toISOString());
        if (endDate) {
            const nextDay = new Date(endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            countParams.push(nextDay.toISOString());
        }
        const countResult = yield database_1.default.query(countQuery, countParams).catch(err => {
            throw new error_1.DatabaseError(`Toplam kayıt sayısı alınırken hata: ${err.message}`, error_2.ErrorCode.DB_QUERY_ERROR);
        });
        const totalCount = parseInt(countResult.rows[0].count, 10);
        res.json({
            status: 'success',
            results: rows.length,
            total: totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit),
            data: { logs: rows }
        });
    }
    catch (error) {
        // Hata middleware'inin işleyebilmesi için hatayı next fonksiyonuna iletiyoruz
        next(error);
    }
});
exports.getUserLogs = getUserLogs;
/**
 * @swagger
 * /logs/actions/{action}:
 *   get:
 *     summary: Belirli bir eylem tipine ait log kayıtlarını getirir
 *     description: Belirtilen eylem tipine göre filtrelenmiş log kayıtlarını listeler.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *         description: Log eylem tipi (örn. 'login', 'viewed_logs', 'invalid_sensor_data' vb.)
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Bir sayfada gösterilecek log sayısı
 *     responses:
 *       200:
 *         description: Filtrelenmiş log kayıtları başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserLog'
 *       401:
 *         description: Kimlik doğrulama hatası
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
const getLogsByAction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { action } = req.params;
        // Log kaydı oluştur
        yield (0, log_model_1.createUserLog)({
            user_id: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0,
            action: log_1.LogAction.VIEWED_LOGS,
            details: { action_type: action },
            ip_address: req.ip
        });
        const logs = yield (0, log_model_1.getUserLogsByAction)(action);
        res.json({
            status: 'success',
            results: logs.length,
            data: { logs }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Log kayıtları alınırken hata oluştu'
        });
    }
});
exports.getLogsByAction = getLogsByAction;
/**
 * @swagger
 * /logs/analytics:
 *   get:
 *     summary: Log analitiklerini getirir
 *     description: Sistem üzerindeki log kayıtlarını analiz ederek özet istatistikler sunar.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 7
 *         description: Kaç günlük verinin analiz edileceği
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
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *         description: Sonuçların nasıl gruplandırılacağı
 *     responses:
 *       200:
 *         description: Log analitikleri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     analytics:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LogAnalytics'
 *       401:
 *         description: Kimlik doğrulama hatası
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
const getLogsAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const days = req.query.days ? parseInt(req.query.days, 10) : 7;
        // Log kaydı oluştur
        yield (0, log_model_1.createUserLog)({
            user_id: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0,
            action: log_1.LogAction.VIEWED_LOGS,
            details: { analytics: true, days },
            ip_address: req.ip
        });
        const analytics = yield (0, log_model_1.getLogAnalytics)(days);
        res.json({
            status: 'success',
            data: { analytics }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Log analizi alınırken hata oluştu'
        });
    }
});
exports.getLogsAnalytics = getLogsAnalytics;
/**
 * @swagger
 * /logs/users/{userId}/activity:
 *   get:
 *     summary: Kullanıcının aktivite istatistiklerini getirir
 *     description: Belirli bir kullanıcının sistem üzerindeki aktivitelerini istatistiksel olarak analiz eder.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Aktivite istatistikleri görüntülenecek kullanıcının ID'si
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
 *         description: Kullanıcı aktivite istatistikleri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     activity_stats:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserActivityStats'
 *       401:
 *         description: Kimlik doğrulama hatası
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
/**
 * @swagger
 * /logs/my-activity:
 *   get:
 *     summary: Kendi aktivite istatistiklerini getirir
 *     description: Oturum açmış kullanıcının sistem üzerindeki aktivitelerini istatistiksel olarak analiz eder.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Kullanıcı aktivite istatistikleri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     activity_stats:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserActivityStats'
 *       401:
 *         description: Kimlik doğrulama hatası
 *       500:
 *         description: Sunucu hatası
 */
const getUserActivityStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = parseInt(req.params.userId, 10) || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0;
        // Erişim kontrolü burada da yapılabilir
        // Basit bir kullanıcı aktivite istatistiği sorgusu
        const query = `
      SELECT 
        action,
        COUNT(*) as count,
        MIN(timestamp) as first_activity,
        MAX(timestamp) as last_activity,
        jsonb_agg(DISTINCT ip_address) as ip_addresses
      FROM user_logs
      WHERE user_id = $1
      GROUP BY action
      ORDER BY count DESC;
    `;
        const { rows } = yield database_1.default.query(query, [userId]);
        // Log kaydı oluştur
        yield (0, log_model_1.createUserLog)({
            user_id: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || 0,
            action: log_1.LogAction.VIEWED_LOGS,
            details: { target_user_id: userId, activity_stats: true },
            ip_address: req.ip
        });
        res.json({
            status: 'success',
            data: { activity_stats: rows }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Kullanıcı aktivite istatistikleri alınırken hata oluştu'
        });
    }
});
exports.getUserActivityStats = getUserActivityStats;
