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
const userModel = __importStar(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../types/user");
const logger_1 = require("./logger");
const dotenv_1 = __importDefault(require("dotenv"));
const company_model_1 = require("../models/company.model");
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
function createSystemAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, company_model_1.createCompaniesTable)();
            logger_1.log.info('Şirket tablosu başarıyla oluşturuldu');
            yield (0, user_model_1.createUsersTable)();
            logger_1.log.info('Kullanıcı tablosu başarıyla oluşturuldu');
            const existingAdmin = yield userModel.findUserByEmail('admin@system.com');
            if (existingAdmin) {
                logger_1.log.info('System Admin kullanıcısı zaten mevcut');
                process.exit(0);
            }
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash('admin123', saltRounds);
            const admin = yield userModel.createUser({
                username: 'systemadmin',
                email: 'admin@system.com',
                password: hashedPassword,
                fullName: 'System Administrator',
                role: user_1.UserRole.SYSTEM_ADMIN
            });
            logger_1.log.info('System Admin kullanıcısı başarıyla oluşturuldu', { userId: admin.id });
            console.log('System Admin kullanıcısı oluşturuldu:');
            console.log('Email: admin@system.com');
            console.log('Şifre: admin123');
            process.exit(0);
        }
        catch (error) {
            logger_1.log.error('System Admin kullanıcısı oluşturulurken hata', {
                error: error instanceof Error ? error.message : String(error)
            });
            console.error('Hata:', error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    });
}
createSystemAdmin();
