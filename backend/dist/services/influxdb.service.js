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
exports.queryAggregatedData = exports.querySensorData = exports.writeSensorData = exports.initInfluxDB = void 0;
const influxdb_client_1 = require("@influxdata/influxdb-client");
const config_1 = __importDefault(require("../config/config"));
const logger_1 = require("../utils/logger");
let client;
let writeApi;
const initInfluxDB = () => {
    try {
        const { url, token, org, bucket } = config_1.default.influxdb;
        if (!token) {
            logger_1.log.warn('InfluxDB token tanımlanmadı. InfluxDB desteği devre dışı bırakıldı.');
            return;
        }
        client = new influxdb_client_1.InfluxDB({ url, token });
        writeApi = client.getWriteApi(org, bucket, 'ns');
        logger_1.log.info('InfluxDB istemcisi başlatıldı', {
            url,
            org,
            bucket
        });
    }
    catch (error) {
        logger_1.log.error('InfluxDB istemcisi başlatılırken hata:', {
            error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
};
exports.initInfluxDB = initInfluxDB;
const writeSensorData = (sensorData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!writeApi) {
            logger_1.log.warn('InfluxDB istemcisi başlatılmadı. Veri yazılamadı.');
            console.warn('InfluxDB istemcisi başlatılmadı. writeApi mevcut değil.');
            return;
        }
        const point = new influxdb_client_1.Point('sensor_data')
            .tag('sensor_id', sensorData.sensor_id)
            .timestamp(new Date(sensorData.timestamp * 1000));
        Object.entries(sensorData).forEach(([key, value]) => {
            if (key !== 'sensor_id' && key !== 'timestamp' && typeof value === 'number') {
                point.floatField(key, value);
            }
        });
        console.log('InfluxDB\'ye yazılacak veri:', sensorData);
        writeApi.writePoint(point);
        yield writeApi.flush();
        console.log('Veri başarıyla InfluxDB\'ye yazıldı:', {
            sensor_id: sensorData.sensor_id,
            timestamp: sensorData.timestamp
        });
        logger_1.log.info('Veri başarıyla InfluxDB\'ye yazıldı', {
            sensor_id: sensorData.sensor_id,
            timestamp: sensorData.timestamp
        });
    }
    catch (error) {
        console.error('InfluxDB\'ye veri yazılırken hata:', error);
        logger_1.log.error('InfluxDB\'ye veri yazılırken hata:', {
            error: error instanceof Error ? error.message : 'Bilinmeyen hata',
            stack: error instanceof Error ? error.stack : '',
            sensor_data: JSON.stringify(sensorData)
        });
        throw error;
    }
});
exports.writeSensorData = writeSensorData;
const querySensorData = (sensorId, start, end) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!client) {
            logger_1.log.warn('InfluxDB istemcisi başlatılmadı. Veri sorgulanamadı.');
            return [];
        }
        const { org } = config_1.default.influxdb;
        const queryApi = client.getQueryApi(org);
        const query = `
      from(bucket: "${config_1.default.influxdb.bucket}")
        |> range(start: ${new Date(start * 1000).toISOString()}, stop: ${new Date(end * 1000).toISOString()})
        |> filter(fn: (r) => r._measurement == "sensor_data")
        |> filter(fn: (r) => r.sensor_id == "${sensorId}")
    `;
        const result = [];
        const rows = yield queryApi.collectRows(query);
        rows.forEach((row) => {
            result.push({
                time: new Date(row._time).getTime() / 1000,
                field: row._field,
                value: row._value,
                sensor_id: row.sensor_id
            });
        });
        return result;
    }
    catch (error) {
        logger_1.log.error('InfluxDB\'den veri sorgulanırken hata:', {
            error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
        throw error;
    }
});
exports.querySensorData = querySensorData;
const queryAggregatedData = (sensorId_1, field_1, ...args_1) => __awaiter(void 0, [sensorId_1, field_1, ...args_1], void 0, function* (sensorId, field, aggregateWindow = "1h", start, end) {
    try {
        if (!client) {
            logger_1.log.warn('InfluxDB istemcisi başlatılmadı. Veri sorgulanamadı.');
            return [];
        }
        const { org } = config_1.default.influxdb;
        const queryApi = client.getQueryApi(org);
        const query = `
      from(bucket: "${config_1.default.influxdb.bucket}")
        |> range(start: ${new Date(start * 1000).toISOString()}, stop: ${new Date(end * 1000).toISOString()})
        |> filter(fn: (r) => r._measurement == "sensor_data")
        |> filter(fn: (r) => r.sensor_id == "${sensorId}")
        |> filter(fn: (r) => r._field == "${field}")
        |> aggregateWindow(every: ${aggregateWindow}, fn: mean, createEmpty: false)
        |> yield(name: "mean")
    `;
        const result = [];
        const rows = yield queryApi.collectRows(query);
        rows.forEach((row) => {
            result.push({
                time: new Date(row._time).getTime() / 1000,
                mean: row._value,
                sensor_id: row.sensor_id,
                field: row._field
            });
        });
        return result;
    }
    catch (error) {
        logger_1.log.error('InfluxDB\'den istatistik sorgulanırken hata:', {
            error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
        throw error;
    }
});
exports.queryAggregatedData = queryAggregatedData;
