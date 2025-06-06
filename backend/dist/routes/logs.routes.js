"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const log_controller_1 = require("../controllers/log.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const permission_1 = require("../types/permission");
const validation_rules_1 = require("../utils/validation.rules");
/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Kullanıcı faaliyetlerini ve sistem loglarını görüntüleme
 */
const router = express_1.default.Router();
// Tüm rotalar için kimlik doğrulama gereklidir
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /logs/users/{userId}:
 *   get:
 *     summary: Belirli bir kullanıcının log kayıtlarını getirir
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Kullanıcı ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Başlangıç tarihi (GG/AA/YYYY)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Bitiş tarihi (GG/AA/YYYY)
 *     responses:
 *       200:
 *         description: Kullanıcı logları başarıyla getirildi
 */
router.get('/users/:userId', (0, auth_middleware_1.requirePermission)(permission_1.Permission.VIEW_LOGS), (0, validator_middleware_1.validate)(validation_rules_1.logValidation.getUserLogs), log_controller_1.getUserLogs);
/**
 * @swagger
 * /logs/my-logs:
 *   get:
 *     summary: Oturum açmış kullanıcının log kayıtlarını getirir
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Kullanıcı logları başarıyla getirildi
 */
router.get('/my-logs', (0, validator_middleware_1.validate)(validation_rules_1.logValidation.getUserLogs), log_controller_1.getUserLogs);
/**
 * @swagger
 * /logs/actions/{action}:
 *   get:
 *     summary: Belirli bir eylem tipine ait logları getirir
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: action
 *         schema:
 *           type: string
 *         required: true
 *         description: Log eylem tipi
 *     responses:
 *       200:
 *         description: Eylem logları başarıyla getirildi
 */
router.get('/actions/:action', (0, auth_middleware_1.requirePermission)(permission_1.Permission.VIEW_LOGS), (0, validator_middleware_1.validate)(validation_rules_1.logValidation.getLogsByAction), log_controller_1.getLogsByAction);
/**
 * @swagger
 * /logs/analytics:
 *   get:
 *     summary: Log analizlerini getirir
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Log analizleri başarıyla getirildi
 */
router.get('/analytics', (0, auth_middleware_1.requirePermission)(permission_1.Permission.VIEW_LOGS), (0, validator_middleware_1.validate)(validation_rules_1.logValidation.getAnalytics), log_controller_1.getLogsAnalytics);
/**
 * @swagger
 * /logs/users/{userId}/activity:
 *   get:
 *     summary: Kullanıcı aktivite istatistiklerini getirir
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Kullanıcı ID
 *     responses:
 *       200:
 *         description: Kullanıcı aktivite istatistikleri başarıyla getirildi
 */
router.get('/users/:userId/activity', (0, auth_middleware_1.requirePermission)(permission_1.Permission.VIEW_LOGS), (0, validator_middleware_1.validate)(validation_rules_1.logValidation.getUserActivityStats), log_controller_1.getUserActivityStats);
/**
 * @swagger
 * /logs/my-activity:
 *   get:
 *     summary: Oturum açmış kullanıcının aktivite istatistiklerini getirir
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Kullanıcı aktivite istatistikleri başarıyla getirildi
 */
router.get('/my-activity', (0, validator_middleware_1.validate)(validation_rules_1.logValidation.getUserActivityStats), log_controller_1.getUserActivityStats);
exports.default = router;
