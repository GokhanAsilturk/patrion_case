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
exports.closeMqttClient = exports.publishMessage = exports.initMqttClient = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const config_1 = __importDefault(require("../config/config"));
const sensor_service_1 = require("./sensor.service");
const influxdb_service_1 = require("./influxdb.service");
const log_model_1 = require("../models/log.model");
const log_1 = require("../types/log");
const socket_1 = require("../socket");
let client;
const initMqttClient = () => {
    try {
        const broker = config_1.default.mqtt.broker || 'mqtt://mqtt:1883';
        client = mqtt_1.default.connect(broker, {
            clientId: config_1.default.mqtt.clientId,
            username: config_1.default.mqtt.username,
            password: config_1.default.mqtt.password,
            clean: true,
            reconnectPeriod: 5000
        });
        client.on('connect', () => {
            console.log('MQTT Broker\'a bağlandı');
            const topics = [
                'sensors/+/data',
                'sensors/+/status'
            ];
            topics.forEach(topic => {
                client.subscribe(topic, (err) => {
                    if (err) {
                        console.error(`${topic} konusuna abone olurken hata:`, err);
                    }
                    else {
                        console.log(`${topic} konusuna abone olundu`);
                    }
                });
            });
        });
        client.on('message', (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log(`Konu ${topic} üzerinden mesaj alındı:`, message.toString());
                if (topic.match(/^sensors\/[\w-]+\/data$/)) {
                    let sensorData;
                    try {
                        sensorData = JSON.parse(message.toString());
                    }
                    catch (parseError) {
                        logInvalidSensorData(topic, message.toString(), 'JSON parse hatası', parseError);
                        return;
                    }
                    if (!isValidSensorData(sensorData)) {
                        logInvalidSensorData(topic, message.toString(), 'Geçersiz sensör veri formatı');
                        return;
                    }
                    yield (0, sensor_service_1.saveSensorData)(sensorData);
                    try {
                        yield (0, influxdb_service_1.writeSensorData)(sensorData);
                        const sensorId = sensorData.sensor_id;
                        const companyId = sensorData.company_id;
                        (0, socket_1.publishSensorData)(sensorId, {
                            temperature: sensorData.temperature,
                            humidity: sensorData.humidity,
                            timestamp: sensorData.timestamp,
                            metadata: sensorData.metadata
                        }, companyId);
                    }
                    catch (influxError) {
                        console.error('InfluxDB\'ye veri yazılırken hata:', influxError instanceof Error ? influxError.message : 'Bilinmeyen hata');
                    }
                }
                if (topic.match(/^sensors\/[\w-]+\/status$/)) {
                    let statusData;
                    try {
                        statusData = JSON.parse(message.toString());
                        if (statusData && statusData.sensor_id) {
                            const sensorId = statusData.sensor_id;
                            const companyId = statusData.company_id;
                            (0, socket_1.publishSensorData)(sensorId, {
                                status: statusData.status,
                                battery: statusData.battery,
                                timestamp: statusData.timestamp || Date.now(),
                                message: statusData.message
                            }, companyId);
                        }
                    }
                    catch (parseError) {
                        logInvalidSensorData(topic, message.toString(), 'JSON parse hatası (durum verisi)', parseError);
                        return;
                    }
                    console.log('Sensör durum bilgisi:', statusData);
                }
            }
            catch (error) {
                console.error('MQTT mesajı işlenirken hata:', error instanceof Error ? error.message : 'Bilinmeyen hata');
                logInvalidSensorData('Genel MQTT Hatası', message.toString(), 'İşleme hatası', error);
            }
        }));
        client.on('error', (err) => {
            console.error('MQTT bağlantı hatası:', err);
        });
        client.on('offline', () => {
            console.warn('MQTT istemcisi çevrimdışı');
        });
        client.on('reconnect', () => {
            console.log('MQTT yeniden bağlanıyor...');
        });
    }
    catch (error) {
        console.error('MQTT istemcisi başlatılırken hata:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    }
};
exports.initMqttClient = initMqttClient;
const isValidSensorData = (data) => {
    if (!data.sensor_id || typeof data.sensor_id !== 'string') {
        return false;
    }
    if (!data.timestamp || typeof data.timestamp !== 'number') {
        return false;
    }
    if (data.temperature !== undefined && typeof data.temperature !== 'number') {
        return false;
    }
    if (data.humidity !== undefined && typeof data.humidity !== 'number') {
        return false;
    }
    return true;
};
const logInvalidSensorData = (topic, rawData, reason, error) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errorDetails = {
            topic,
            rawData,
            reason,
            error: error instanceof Error ? error.message : error
        };
        console.error(`Hatalı sensör verisi: ${reason}`, errorDetails);
        yield (0, log_model_1.createUserLog)({
            user_id: 1,
            action: log_1.LogAction.INVALID_SENSOR_DATA,
            details: errorDetails,
            ip_address: 'system'
        });
    }
    catch (logError) {
        console.error('Hatalı veri loglanırken hata:', logError instanceof Error ? logError.message : 'Bilinmeyen hata');
    }
});
const publishMessage = (topic, message) => {
    if (!client || !client.connected) {
        console.error('MQTT istemcisi bağlı değil. Mesaj yayınlanamıyor.');
        return;
    }
    try {
        const messageString = typeof message === 'object' ? JSON.stringify(message) : message;
        client.publish(topic, messageString);
    }
    catch (error) {
        console.error('MQTT mesajı yayınlanırken hata:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    }
};
exports.publishMessage = publishMessage;
const closeMqttClient = () => {
    if (client) {
        client.end();
        console.log('MQTT bağlantısı kapatıldı');
    }
};
exports.closeMqttClient = closeMqttClient;
function onStatusMessage(topic, message) {
    try {
        const rawData = message.toString();
        console.log(`MQTT Durum Mesajı Alındı (${topic}):`, rawData);
        const data = JSON.parse(rawData);
        console.log('MQTT Mesaj içeriği (parse edilmiş):', data);
    }
    catch (error) {
    }
}
