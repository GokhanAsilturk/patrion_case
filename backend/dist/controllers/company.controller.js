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
exports.updateCompany = exports.createCompany = exports.getCompanyById = exports.getAllCompanies = void 0;
const companyModel = __importStar(require("../models/company.model"));
const logger_1 = require("../utils/logger");
/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Tüm şirketleri listeler
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Şirketler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     companies:
 *                       type: array
 */
const getAllCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield companyModel.getAllCompanies();
        res.status(200).json({
            status: 'success',
            data: { companies }
        });
    }
    catch (error) {
        logger_1.log.error('Şirketler listelenirken hata', {
            error: error instanceof Error ? error.message : String(error)
        });
        res.status(500).json({
            status: 'error',
            message: 'Şirketler listelenirken bir hata oluştu'
        });
    }
});
exports.getAllCompanies = getAllCompanies;
/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: ID'ye göre şirket bilgilerini getirir
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Şirket ID
 *     responses:
 *       200:
 *         description: Şirket başarıyla getirildi
 *       404:
 *         description: Şirket bulunamadı
 */
const getCompanyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                status: 'error',
                message: 'Geçersiz ID formatı'
            });
            return;
        }
        const company = yield companyModel.getCompanyById(id);
        if (!company) {
            res.status(404).json({
                status: 'error',
                message: 'Şirket bulunamadı'
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: { company }
        });
    }
    catch (error) {
        logger_1.log.error('Şirket getirilirken hata', {
            error: error instanceof Error ? error.message : String(error),
            companyId: req.params.id
        });
        res.status(500).json({
            status: 'error',
            message: 'Şirket getirilirken bir hata oluştu'
        });
    }
});
exports.getCompanyById = getCompanyById;
/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Yeni bir şirket oluşturur (Sadece System Admin yetkisi ile)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "XYZ Fabrikası"
 *               description:
 *                 type: string
 *                 example: "XYZ Fabrikası örnek açıklama"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Şirket başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz istek verisi
 */
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyData = req.body;
        // Kullanıcının system_admin olup olmadığını kontrol et
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'system_admin') {
            res.status(403).json({
                status: 'error',
                message: 'Bu işlem için yetkiniz bulunmamaktadır. Sadece System Admin şirket oluşturabilir.'
            });
            return;
        }
        const newCompany = yield companyModel.createCompany(companyData);
        res.status(201).json({
            status: 'success',
            message: 'Şirket başarıyla oluşturuldu',
            data: { company: newCompany }
        });
    }
    catch (error) {
        logger_1.log.error('Şirket oluşturulurken hata', {
            error: error instanceof Error ? error.message : String(error)
        });
        res.status(400).json({
            status: 'error',
            message: 'Şirket oluşturulurken bir hata oluştu'
        });
    }
});
exports.createCompany = createCompany;
/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Şirket bilgilerini günceller (Sadece System Admin yetkisi ile)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Şirket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Güncellenmiş Şirket Adı"
 *               description:
 *                 type: string
 *                 example: "Güncellenmiş açıklama"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Şirket başarıyla güncellendi
 *       404:
 *         description: Şirket bulunamadı
 */
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = parseInt(req.params.id);
        const updateData = req.body;
        // Kullanıcının system_admin olup olmadığını kontrol et
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'system_admin') {
            res.status(403).json({
                status: 'error',
                message: 'Bu işlem için yetkiniz bulunmamaktadır. Sadece System Admin şirketleri güncelleyebilir.'
            });
            return;
        }
        if (isNaN(id)) {
            res.status(400).json({
                status: 'error',
                message: 'Geçersiz ID formatı'
            });
            return;
        }
        const updatedCompany = yield companyModel.updateCompany(id, updateData);
        if (!updatedCompany) {
            res.status(404).json({
                status: 'error',
                message: 'Şirket bulunamadı'
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            message: 'Şirket başarıyla güncellendi',
            data: { company: updatedCompany }
        });
    }
    catch (error) {
        logger_1.log.error('Şirket güncellenirken hata', {
            error: error instanceof Error ? error.message : String(error),
            companyId: req.params.id
        });
        res.status(400).json({
            status: 'error',
            message: 'Şirket güncellenirken bir hata oluştu'
        });
    }
});
exports.updateCompany = updateCompany;
