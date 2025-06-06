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
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("./logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function resetDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Mevcut tabloları kaldırma işlemi başlıyor...');
            yield database_1.default.query(`
      DROP TABLE IF EXISTS user_logs CASCADE;
      DROP TABLE IF EXISTS sensor_data CASCADE;
      DROP TABLE IF EXISTS sensors CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS companies CASCADE;
    `);
            console.log('Tüm tablolar başarıyla kaldırıldı.');
            console.log('Veritabanını sıfırlama işlemi tamamlandı. Şimdi uygulamayı başlatarak tabloları yeniden oluşturabilirsiniz.');
            console.log('System admin oluşturmak için: npm run create-admin');
            process.exit(0);
        }
        catch (error) {
            logger_1.log.error('Veritabanı sıfırlanırken hata', {
                error: error instanceof Error ? error.message : String(error)
            });
            console.error('Hata:', error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    });
}
resetDatabase();
