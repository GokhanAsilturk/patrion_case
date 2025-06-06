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
exports.logReportDownload = exports.logDataExport = exports.logCompanyDataView = exports.logUserProfileView = exports.logSensorDataView = exports.logUserActivity = void 0;
const log_model_1 = require("../models/log.model");
const log_1 = require("../types/log");
/**
 * Kullanıcı sayfa ziyaretlerini ve aktivitelerini otomatik olarak loglar
 * Bu middleware, kullanıcı belirli sayfalara eriştiğinde log kaydı oluşturur
 */
const logUserActivity = (action, detailsProvider) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Kullanıcı kimliği kontrolü
            if (!req.user || !req.user.id) {
                // Kimlik doğrulama yapılmamış, middleware'i atlayıp devam et
                return next();
            }
            // Detayları hazırla (eğer detay sağlayıcı fonksiyon verilmişse)
            const details = detailsProvider ? detailsProvider(req) : {};
            // Log kaydı oluştur
            yield (0, log_model_1.createUserLog)({
                user_id: req.user.id,
                action,
                details,
                ip_address: req.ip
            });
            // Sonraki middleware'e devam et
            next();
        }
        catch (error) {
            // Hata durumunda, loglama işlemi başarısız olsa bile uygulamanın çalışmaya devam etmesini sağla
            console.error('Kullanıcı aktivitesi loglanırken hata:', error instanceof Error ? error.message : 'Bilinmeyen hata');
            next();
        }
    });
};
exports.logUserActivity = logUserActivity;
/**
 * Sensör verilerini görüntüleme erişimini loglar
 */
exports.logSensorDataView = (0, exports.logUserActivity)(log_1.LogAction.VIEWED_SENSOR_DATA, (req) => ({
    sensor_id: req.params.sensorId || req.params.sensor_id,
    query_params: req.query
}));
/**
 * Kullanıcı profilini görüntüleme erişimini loglar
 */
exports.logUserProfileView = (0, exports.logUserActivity)(log_1.LogAction.VIEWED_USER_PROFILE, (req) => ({
    target_user_id: req.params.userId || req.params.id
}));
/**
 * Şirket verisi görüntüleme erişimini loglar
 */
exports.logCompanyDataView = (0, exports.logUserActivity)(log_1.LogAction.VIEWED_COMPANY_DATA, (req) => ({
    company_id: req.params.companyId || req.params.id
}));
/**
 * Veri dışa aktarma işlemini loglar
 */
exports.logDataExport = (0, exports.logUserActivity)(log_1.LogAction.EXPORTED_DATA, (req) => ({
    export_type: req.query.type || 'default',
    format: req.query.format || 'json'
}));
/**
 * Veri raporu indirme işlemini loglar
 */
exports.logReportDownload = (0, exports.logUserActivity)(log_1.LogAction.DOWNLOADED_REPORT, (req) => ({
    report_id: req.params.reportId,
    report_type: req.query.type
}));
