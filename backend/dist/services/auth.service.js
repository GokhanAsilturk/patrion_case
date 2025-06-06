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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const userModel = __importStar(require("../models/user.model"));
const jwt_utils_1 = require("../utils/jwt.utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_1 = require("../utils/error");
const error_2 = require("../types/error");
const logger_1 = require("../utils/logger");
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield userModel.findUserByEmail(userData.email);
        if (existingUser) {
            throw new error_1.DatabaseError('Bu email adresi zaten kayıtlı', error_2.ErrorCode.USER_ALREADY_EXISTS);
        }
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(userData.password, saltRounds);
        const _a = userData, { full_name } = _a, rest = __rest(_a, ["full_name"]);
        const userDataWithCorrectFields = Object.assign(Object.assign({}, rest), { fullName: full_name !== null && full_name !== void 0 ? full_name : userData.fullName, password: hashedPassword });
        const user = yield userModel.createUser(userDataWithCorrectFields)
            .catch(err => {
            throw new error_1.DatabaseError(`Kullanıcı oluşturulurken veritabanı hatası: ${err.message}`, error_2.ErrorCode.DB_QUERY_ERROR);
        });
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return Object.assign({}, userWithoutPassword);
    }
    catch (error) {
        // Özel hataları tekrar fırlat
        if (error instanceof error_1.DatabaseError || error instanceof error_1.ValidationError) {
            throw error;
        }
        // Tanımlanmamış hatalar için logla ve DatabaseError oluştur
        logger_1.log.error('Kullanıcı kaydı sırasında tanımlanmamış hata:', {
            error: error instanceof Error ? error.message : 'Bilinmeyen hata',
            stack: error instanceof Error ? error.stack : undefined
        });
        throw new error_1.DatabaseError('Kullanıcı kaydı sırasında bir hata oluştu', error_2.ErrorCode.OPERATION_FAILED, { originalError: error instanceof Error ? error.message : 'Bilinmeyen hata' });
    }
});
exports.register = register;
const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        logger_1.log.info('Giriş deneme başlatıldı', { email: credentials.email });
        const user = yield userModel.findUserByEmail(credentials.email)
            .catch(err => {
            logger_1.log.error('Kullanıcı arama hatası', { error: err.message });
            throw new error_1.DatabaseError(`Kullanıcı aranırken veritabanı hatası: ${err.message}`, error_2.ErrorCode.DB_QUERY_ERROR);
        });
        if (!user) {
            logger_1.log.warn('Kullanıcı bulunamadı', { email: credentials.email });
            throw new error_1.AuthenticationError('Geçersiz kullanıcı adı veya şifre', error_2.ErrorCode.INVALID_CREDENTIALS);
        }
        logger_1.log.info('Kullanıcı bulundu, şifre kontrolü yapılıyor', {
            userId: user.id,
            hashedPasswordLength: (_a = user.password) === null || _a === void 0 ? void 0 : _a.length,
            providedPasswordLength: (_b = credentials.password) === null || _b === void 0 ? void 0 : _b.length
        });
        const isValidPassword = yield bcrypt_1.default.compare(credentials.password, user.password)
            .catch(err => {
            logger_1.log.error('Şifre karşılaştırma hatası', { error: err.message });
            throw new error_1.AuthenticationError(`Şifre doğrulama hatası: ${err.message}`, error_2.ErrorCode.INVALID_CREDENTIALS);
        });
        logger_1.log.info('Şifre kontrolü tamamlandı', { isValid: isValidPassword });
        if (!isValidPassword) {
            logger_1.log.warn('Geçersiz şifre', { userId: user.id });
            throw new error_1.AuthenticationError('Geçersiz kullanıcı adı veya şifre', error_2.ErrorCode.INVALID_CREDENTIALS);
        }
        const token = (0, jwt_utils_1.generateToken)(user);
        logger_1.log.info('Giriş başarılı', { userId: user.id });
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return Object.assign(Object.assign({}, userWithoutPassword), { token });
    }
    catch (error) {
        // Özel hataları tekrar fırlat
        if (error instanceof error_1.AuthenticationError || error instanceof error_1.DatabaseError) {
            throw error;
        }
        // Tanımlanmamış hatalar için logla ve AuthenticationError oluştur
        logger_1.log.error('Giriş sırasında tanımlanmamış hata:', {
            error: error instanceof Error ? error.message : 'Bilinmeyen hata',
            stack: error instanceof Error ? error.stack : undefined
        });
        throw new error_1.AuthenticationError('Giriş yapılırken bir hata oluştu', error_2.ErrorCode.INVALID_CREDENTIALS, { originalError: error instanceof Error ? error.message : 'Bilinmeyen hata' });
    }
});
exports.login = login;
