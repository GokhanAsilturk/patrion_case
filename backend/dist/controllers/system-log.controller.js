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
exports.getAvailableLogFiles = exports.getSystemLogs = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const log_model_1 = require("../models/log.model");
const log_1 = require("../types/log");
const user_1 = require("../types/user");
/**
 * @swagger
 * /system-logs:
 *   get:
 *     summary: Sistem log dosyalarını getirir
 *     description: Sadece System Admin rolüne sahip kullanıcılar tarafından görüntülenebilir
 *     tags: [System Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, error, exceptions]
 *         description: Log türü (all=combined.log, error=error.log, exceptions=exceptions.log)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Bir sayfada gösterilecek log sayısı
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Aranacak metin
 *     responses:
 *       200:
 *         description: Sistem logları başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total:
 *                   type: integer
 *                   example: 120
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Kimlik doğrulama hatası
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
const getSystemLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Kullanıcının System Admin rolüne sahip olduğunu doğrula
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== user_1.UserRole.SYSTEM_ADMIN) {
            res.status(403).json({
                status: 'error',
                message: 'Bu işleme yetkiniz bulunmamaktadır. Sadece System Admin rolüne sahip kullanıcılar sistem loglarını görüntüleyebilir.'
            });
            return;
        }
        // Query parametrelerini al
        const type = req.query.type || 'all';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
        const search = req.query.search;
        // Log dosyasını belirle
        let logFileName;
        switch (type) {
            case 'error':
                logFileName = 'error.log';
                break;
            case 'exceptions':
                logFileName = 'exceptions.log';
                break;
            default:
                logFileName = 'combined.log';
        }
        // Log dosyası yolunu oluştur
        const logFilePath = path_1.default.join(process.cwd(), 'logs', logFileName);
        // Dosyanın varlığını kontrol et
        if (!fs_1.default.existsSync(logFilePath)) {
            res.status(404).json({
                status: 'error',
                message: `Log dosyası bulunamadı: ${logFileName}`
            });
            return;
        }
        // Dosyayı oku
        const fileContent = fs_1.default.readFileSync(logFilePath, 'utf-8');
        // Satırlara ayır
        let logLines = fileContent.split('\n').filter(line => line.trim() !== '');
        // Eğer arama parametresi varsa, filtreleme yap
        if (search) {
            logLines = logLines.filter(line => line.toLowerCase().includes(search.toLowerCase()));
        }
        // Toplam log sayısı
        const totalLogs = logLines.length;
        // Sayfalama
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, totalLogs);
        const paginatedLogs = logLines.slice(startIndex, endIndex);
        // Log görüntüleme işlemini kaydet
        yield (0, log_model_1.createUserLog)({
            user_id: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || 0,
            action: log_1.LogAction.VIEWED_LOGS,
            details: {
                log_type: type,
                page,
                limit,
                search: search || null
            },
            ip_address: req.ip
        });
        res.json({
            status: 'success',
            total: totalLogs,
            page,
            totalPages: Math.ceil(totalLogs / limit),
            data: {
                logs: paginatedLogs
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Sistem logları alınırken hata oluştu'
        });
    }
});
exports.getSystemLogs = getSystemLogs;
/**
 * @swagger
 * /system-logs/available:
 *   get:
 *     summary: Mevcut sistem log dosyalarını listeler
 *     description: Sadece System Admin rolüne sahip kullanıcılar tarafından görüntülenebilir
 *     tags: [System Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mevcut log dosyaları başarıyla listelendi
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
 *                     logFiles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           fileName:
 *                             type: string
 *                           size:
 *                             type: string
 *                           lastModified:
 *                             type: string
 *       401:
 *         description: Kimlik doğrulama hatası
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
const getAvailableLogFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Kullanıcının System Admin rolüne sahip olduğunu doğrula
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== user_1.UserRole.SYSTEM_ADMIN) {
            res.status(403).json({
                status: 'error',
                message: 'Bu işleme yetkiniz bulunmamaktadır. Sadece System Admin rolüne sahip kullanıcılar sistem loglarını görüntüleyebilir.'
            });
            return;
        }
        // Logs klasörü yolunu oluştur
        const logsDir = path_1.default.join(process.cwd(), 'logs');
        // Klasörün varlığını kontrol et
        if (!fs_1.default.existsSync(logsDir)) {
            res.status(404).json({
                status: 'error',
                message: 'Logs klasörü bulunamadı'
            });
            return;
        }
        // Klasördeki dosyaları oku
        const files = fs_1.default.readdirSync(logsDir);
        // Dosya bilgilerini oluştur
        const logFiles = files.map(fileName => {
            const filePath = path_1.default.join(logsDir, fileName);
            const stats = fs_1.default.statSync(filePath);
            return {
                fileName,
                size: formatFileSize(stats.size),
                lastModified: stats.mtime.toISOString()
            };
        });
        // Log görüntüleme işlemini kaydet
        yield (0, log_model_1.createUserLog)({
            user_id: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || 0,
            action: log_1.LogAction.VIEWED_LOGS,
            details: { log_files_listing: true },
            ip_address: req.ip
        });
        res.json({
            status: 'success',
            data: {
                logFiles
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Log dosyaları listelenirken hata oluştu'
        });
    }
});
exports.getAvailableLogFiles = getAvailableLogFiles;
/**
 * Dosya boyutunu formatlar (KB, MB, GB)
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
