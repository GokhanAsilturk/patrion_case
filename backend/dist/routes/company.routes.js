"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController = __importStar(require("../controllers/company.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const log_tracker_middleware_1 = require("../middlewares/log-tracker.middleware");
const router = (0, express_1.Router)();
// Tüm şirketleri listele - Yetki gerektiren endpoint
router.get('/', auth_middleware_1.authenticate, log_tracker_middleware_1.logCompanyDataView, companyController.getAllCompanies);
// ID'ye göre şirket bilgilerini getir - Yetki gerektiren endpoint
router.get('/:id', auth_middleware_1.authenticate, log_tracker_middleware_1.logCompanyDataView, companyController.getCompanyById);
// Yeni şirket oluştur - Yetki gerektiren endpoint (System Admin kontrolü controller'da yapılıyor)
router.post('/', auth_middleware_1.authenticate, companyController.createCompany);
// Şirket bilgilerini güncelle - Yetki gerektiren endpoint (System Admin kontrolü controller'da yapılıyor)
router.put('/:id', auth_middleware_1.authenticate, companyController.updateCompany);
exports.default = router;
