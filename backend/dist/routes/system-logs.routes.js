"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const system_log_controller_1 = require("../controllers/system-log.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_1 = require("../types/user");
/**
 * @swagger
 * tags:
 *   name: System Logs
 *   description: Sistem log dosyalarının yönetimi
 */
const router = express_1.default.Router();
// Tüm rotalar için kimlik doğrulama ve yetkilendirme gereklidir (sadece System Admin)
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)([user_1.UserRole.SYSTEM_ADMIN]));
// Sistem log dosyalarını getir
router.get('/', system_log_controller_1.getSystemLogs);
// Kullanılabilir log dosyalarını listele
router.get('/available', system_log_controller_1.getAvailableLogFiles);
exports.default = router;
