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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const companyModel = __importStar(require("../models/company.model"));
const userModel = __importStar(require("../models/user.model"));
const user_1 = require("../types/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("../utils/logger");
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Seed işlemi başlatılıyor...');
        // Varsayılan şirket verisi
        const company = {
            id: 1,
            name: 'Patrion',
            description: 'test',
            status: 'active'
        };
        // Varsayılan kullanıcı verisi
        const user = {
            username: 'systemadmin',
            email: 'admin@system.com',
            password: 'admin123',
            fullName: 'System Admin',
            company_id: 1,
            role: user_1.UserRole.SYSTEM_ADMIN
        };
        // Veritabanı bağlantısını test et
        try {
            // Bağlantı testi yap
            yield new Promise((resolve, reject) => {
                const testQuery = 'SELECT 1';
                const timeout = setTimeout(() => {
                    reject(new Error('Veritabanı bağlantı zaman aşımı'));
                }, 5000);
                Promise.resolve().then(() => __importStar(require('../config/database'))).then((db) => __awaiter(void 0, void 0, void 0, function* () {
                    try {
                        const result = yield db.default.query(testQuery);
                        if (result.rows && result.rows.length > 0) {
                            console.log('Seed veritabanı bağlantı kontrolü başarılı');
                            clearTimeout(timeout);
                            resolve();
                        }
                        else {
                            reject(new Error('Veritabanı sorgu sonuç döndürmedi'));
                        }
                    }
                    catch (err) {
                        clearTimeout(timeout);
                        reject(err);
                    }
                })).catch(err => {
                    clearTimeout(timeout);
                    reject(err);
                });
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.log.error('Seed veritabanı bağlantı kontrolü başarısız', { error: errorMessage });
            throw new Error(`Veritabanı bağlantı hatası: ${errorMessage}`);
        }
        // Veritabanında şirketi kontrol et ve ekle
        try {
            console.log('Şirket kontrolü yapılıyor...');
            const existingCompany = yield companyModel.getCompanyById(company.id);
            if (!existingCompany) {
                console.log('Şirket kaydı bulunamadı, oluşturuluyor...');
                yield companyModel.createCompany(company);
                logger_1.log.info('Şirket eklendi', { company: Object.assign({}, company) });
                console.log('Şirket başarıyla oluşturuldu:', company.name);
            }
            else {
                logger_1.log.info('Şirket zaten mevcut', { companyId: company.id });
                console.log('Şirket zaten mevcut:', existingCompany.name);
            }
        }
        catch (companyError) {
            const errorMessage = companyError instanceof Error ? companyError.message : 'Bilinmeyen hata';
            logger_1.log.error('Şirket seed işlemi sırasında hata', { error: errorMessage });
            console.error('Şirket seed hatası:', errorMessage);
            throw companyError; // Hatayı üst düzeye ilet
        }
        // Veritabanında kullanıcıyı kontrol et ve ekle
        try {
            console.log('Kullanıcı kontrolü yapılıyor...');
            const existingUser = yield userModel.findUserByEmail(user.email);
            if (!existingUser) {
                console.log('Kullanıcı bulunamadı, oluşturuluyor...');
                // Şifreyi hash'le
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash(user.password, saltRounds);
                // Hash'lenmiş şifre ile kullanıcı oluştur
                yield userModel.createUser(Object.assign(Object.assign({}, user), { password: hashedPassword }));
                logger_1.log.info('Kullanıcı eklendi', { user: Object.assign(Object.assign({}, user), { password: '[GIZLI]' }) });
                console.log('Kullanıcı başarıyla oluşturuldu:', user.username);
            }
            else {
                logger_1.log.info('Kullanıcı zaten mevcut', { email: user.email });
                console.log('Kullanıcı zaten mevcut:', existingUser.username);
            }
        }
        catch (userError) {
            const errorMessage = userError instanceof Error ? userError.message : 'Bilinmeyen hata';
            logger_1.log.error('Kullanıcı seed işlemi sırasında hata', { error: errorMessage });
            console.error('Kullanıcı seed hatası:', errorMessage);
            throw userError; // Hatayı üst düzeye ilet
        }
    }
    catch (error) {
        logger_1.log.error('Seed işlemi sırasında genel hata', { error: error instanceof Error ? error.message : 'Bilinmeyen hata' });
    }
});
exports.default = seedDatabase;
