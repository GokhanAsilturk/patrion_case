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
exports.io = exports.publishSensorData = exports.initSocketIO = void 0;
const socket_io_1 = require("socket.io");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const log_model_1 = require("./models/log.model");
const log_1 = require("./types/log");
let io = null;
exports.io = io;
const initSocketIO = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // Üretim ortamında kısıtlanmalıdır
            methods: ['GET', 'POST']
        }
    });
    // JWT ile doğrulama middleware
    io.use(auth_middleware_1.authenticateSocket);
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const userId = (_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.id;
            const username = (_b = socket.data.user) === null || _b === void 0 ? void 0 : _b.username;
            console.log(`Kullanıcı bağlandı: ${username} (${userId})`);
            // Kullanıcı log kaydı
            if (userId) {
                yield (0, log_model_1.createUserLog)({
                    user_id: userId,
                    action: log_1.LogAction.VIEWED_SENSOR_DATA,
                    details: {
                        connection_id: socket.id,
                        ip_address: socket.handshake.address
                    },
                    ip_address: socket.handshake.address
                });
            }
            // Odaya katılma
            socket.on('join_company', (companyId) => {
                socket.join(`company_${companyId}`);
                console.log(`${username} kullanıcısı company_${companyId} odasına katıldı`);
            });
            socket.on('join_sensor', (sensorId) => {
                socket.join(`sensor_${sensorId}`);
                console.log(`${username} kullanıcısı sensor_${sensorId} odasına katıldı`);
            });
            // YENİ: Sensör verisi yayınlama endpoint'i
            socket.on('publish_sensor_data', (data) => {
                const { sensorId, readings } = data;
                if (!sensorId || !readings) {
                    socket.emit('error', { message: 'Geçersiz sensör verisi formatı' });
                    return;
                }
                // Sensör odasına veri yayınlama
                io === null || io === void 0 ? void 0 : io.to(`sensor_${sensorId}`).emit('sensor_data_update', {
                    sensorId,
                    readings,
                    timestamp: new Date().toISOString()
                });
                // İlgili şirkete bildirim gönderme (sensör şirket ilişkisi varsa)
                if (data.companyId) {
                    io === null || io === void 0 ? void 0 : io.to(`company_${data.companyId}`).emit('sensor_activity', {
                        sensorId,
                        type: 'data_update',
                        timestamp: new Date().toISOString()
                    });
                }
                console.log(`Sensör verisi yayınlandı: sensor_${sensorId}`);
            });
            // YENİ: Bildirim gönderme endpoint'i
            socket.on('send_notification', (data) => {
                const { targetType, targetId, notificationType, message } = data;
                if (!targetType || !targetId || !notificationType) {
                    socket.emit('error', { message: 'Geçersiz bildirim formatı' });
                    return;
                }
                const notificationData = {
                    type: notificationType,
                    message: message || 'Yeni bildirim',
                    timestamp: new Date().toISOString(),
                    senderId: userId
                };
                // Hedef tipine göre odaya bildirim gönderme
                if (targetType === 'company') {
                    io === null || io === void 0 ? void 0 : io.to(`company_${targetId}`).emit('notification', notificationData);
                    console.log(`Şirket bildirimi gönderildi: company_${targetId}`);
                }
                else if (targetType === 'sensor') {
                    io === null || io === void 0 ? void 0 : io.to(`sensor_${targetId}`).emit('notification', notificationData);
                    console.log(`Sensör bildirimi gönderildi: sensor_${targetId}`);
                }
                else if (targetType === 'user' && targetId) {
                    // Kullanıcıya özel bildirim - burada kullanıcının aktif soket bağlantısını bulmak gerekebilir
                    // Bu örnek basitleştirilmiştir, gerçek uygulamada kullanıcı-soket eşleştirmesi gerekecek
                    console.log(`Kullanıcı bildirimi gönderildi: ${targetId}`);
                }
            });
            // Bağlantı kopma
            socket.on('disconnect', () => {
                console.log(`Kullanıcı ayrıldı: ${username} (${userId})`);
            });
        }
        catch (error) {
            console.error('Socket bağlantısında hata:', error instanceof Error ? error.message : 'Bilinmeyen hata');
        }
    }));
    return io;
};
exports.initSocketIO = initSocketIO;
// YENİ: Programatik olarak sensör verisi yayınlama yardımcı fonksiyonu
const publishSensorData = (sensorId, readings, companyId) => {
    if (!io) {
        console.error('Socket.IO henüz başlatılmadı');
        return false;
    }
    io.to(`sensor_${sensorId}`).emit('sensor_data_update', {
        sensorId,
        readings,
        timestamp: new Date().toISOString()
    });
    if (companyId) {
        io.to(`company_${companyId}`).emit('sensor_activity', {
            sensorId,
            type: 'data_update',
            timestamp: new Date().toISOString()
        });
    }
    return true;
};
exports.publishSensorData = publishSensorData;
