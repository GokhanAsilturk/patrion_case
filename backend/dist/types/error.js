"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS_CODES = exports.ErrorCode = void 0;
/**
 * Uygulama için hata kodları
 */
var ErrorCode;
(function (ErrorCode) {
    // Genel hatalar (1000-1999)
    ErrorCode[ErrorCode["UNKNOWN_ERROR"] = 1000] = "UNKNOWN_ERROR";
    ErrorCode[ErrorCode["VALIDATION_ERROR"] = 1001] = "VALIDATION_ERROR";
    ErrorCode[ErrorCode["INVALID_REQUEST"] = 1002] = "INVALID_REQUEST";
    ErrorCode[ErrorCode["NOT_FOUND"] = 1004] = "NOT_FOUND";
    ErrorCode[ErrorCode["OPERATION_FAILED"] = 1005] = "OPERATION_FAILED";
    // Yetkilendirme ve kimlik doğrulama hataları (2000-2999)
    ErrorCode[ErrorCode["UNAUTHORIZED"] = 2000] = "UNAUTHORIZED";
    ErrorCode[ErrorCode["INVALID_CREDENTIALS"] = 2001] = "INVALID_CREDENTIALS";
    ErrorCode[ErrorCode["TOKEN_EXPIRED"] = 2002] = "TOKEN_EXPIRED";
    ErrorCode[ErrorCode["TOKEN_INVALID"] = 2003] = "TOKEN_INVALID";
    ErrorCode[ErrorCode["FORBIDDEN"] = 2004] = "FORBIDDEN";
    // Veritabanı hataları (3000-3999)
    ErrorCode[ErrorCode["DB_CONNECTION_ERROR"] = 3000] = "DB_CONNECTION_ERROR";
    ErrorCode[ErrorCode["DB_QUERY_ERROR"] = 3001] = "DB_QUERY_ERROR";
    ErrorCode[ErrorCode["DUPLICATE_ENTRY"] = 3002] = "DUPLICATE_ENTRY";
    ErrorCode[ErrorCode["FOREIGN_KEY_VIOLATION"] = 3003] = "FOREIGN_KEY_VIOLATION";
    ErrorCode[ErrorCode["DATA_INTEGRITY_ERROR"] = 3004] = "DATA_INTEGRITY_ERROR";
    // Sensör ve IoT cihaz hataları (4000-4999)
    ErrorCode[ErrorCode["SENSOR_NOT_FOUND"] = 4000] = "SENSOR_NOT_FOUND";
    ErrorCode[ErrorCode["SENSOR_DATA_INVALID"] = 4001] = "SENSOR_DATA_INVALID";
    ErrorCode[ErrorCode["MQTT_CONNECTION_ERROR"] = 4002] = "MQTT_CONNECTION_ERROR";
    ErrorCode[ErrorCode["MQTT_PUBLISH_ERROR"] = 4003] = "MQTT_PUBLISH_ERROR";
    ErrorCode[ErrorCode["MQTT_SUBSCRIPTION_ERROR"] = 4004] = "MQTT_SUBSCRIPTION_ERROR";
    // InfluxDB hataları (5000-5999)
    ErrorCode[ErrorCode["INFLUXDB_CONNECTION_ERROR"] = 5000] = "INFLUXDB_CONNECTION_ERROR";
    ErrorCode[ErrorCode["INFLUXDB_QUERY_ERROR"] = 5001] = "INFLUXDB_QUERY_ERROR";
    ErrorCode[ErrorCode["INFLUXDB_WRITE_ERROR"] = 5002] = "INFLUXDB_WRITE_ERROR";
    // Dış API ve servis hataları (6000-6999)
    ErrorCode[ErrorCode["EXTERNAL_API_ERROR"] = 6000] = "EXTERNAL_API_ERROR";
    ErrorCode[ErrorCode["SERVICE_UNAVAILABLE"] = 6001] = "SERVICE_UNAVAILABLE";
    ErrorCode[ErrorCode["TIMEOUT_ERROR"] = 6002] = "TIMEOUT_ERROR";
    // İş mantığı hataları (7000-7999)
    ErrorCode[ErrorCode["BUSINESS_RULE_VIOLATION"] = 7000] = "BUSINESS_RULE_VIOLATION";
    ErrorCode[ErrorCode["INVALID_OPERATION"] = 7001] = "INVALID_OPERATION";
    // Dosya işlemleri hataları (8000-8999)
    ErrorCode[ErrorCode["FILE_NOT_FOUND"] = 8000] = "FILE_NOT_FOUND";
    ErrorCode[ErrorCode["FILE_TOO_LARGE"] = 8001] = "FILE_TOO_LARGE";
    ErrorCode[ErrorCode["INVALID_FILE_TYPE"] = 8002] = "INVALID_FILE_TYPE";
    ErrorCode[ErrorCode["FILE_READ_ERROR"] = 8003] = "FILE_READ_ERROR";
    ErrorCode[ErrorCode["FILE_WRITE_ERROR"] = 8004] = "FILE_WRITE_ERROR";
    // Kullanıcı ve yetki hataları (9000-9999)
    ErrorCode[ErrorCode["USER_NOT_FOUND"] = 9000] = "USER_NOT_FOUND";
    ErrorCode[ErrorCode["USER_ALREADY_EXISTS"] = 9001] = "USER_ALREADY_EXISTS";
    ErrorCode[ErrorCode["INVALID_ROLE"] = 9002] = "INVALID_ROLE";
    ErrorCode[ErrorCode["ROLE_NOT_ALLOWED"] = 9003] = "ROLE_NOT_ALLOWED";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
/**
 * HTTP durum kodları ile eşleşen ErrorCode değerleri
 */
exports.HTTP_STATUS_CODES = {
    // Genel hatalar
    [ErrorCode.UNKNOWN_ERROR]: 500,
    [ErrorCode.VALIDATION_ERROR]: 400,
    [ErrorCode.INVALID_REQUEST]: 400,
    [ErrorCode.NOT_FOUND]: 404,
    [ErrorCode.OPERATION_FAILED]: 500,
    // Yetkilendirme ve kimlik doğrulama hataları
    [ErrorCode.UNAUTHORIZED]: 401,
    [ErrorCode.INVALID_CREDENTIALS]: 401,
    [ErrorCode.TOKEN_EXPIRED]: 401,
    [ErrorCode.TOKEN_INVALID]: 401,
    [ErrorCode.FORBIDDEN]: 403,
    // Veritabanı hataları
    [ErrorCode.DB_CONNECTION_ERROR]: 500,
    [ErrorCode.DB_QUERY_ERROR]: 500,
    [ErrorCode.DUPLICATE_ENTRY]: 409,
    [ErrorCode.FOREIGN_KEY_VIOLATION]: 400,
    [ErrorCode.DATA_INTEGRITY_ERROR]: 500,
    // Sensör ve IoT cihaz hataları
    [ErrorCode.SENSOR_NOT_FOUND]: 404,
    [ErrorCode.SENSOR_DATA_INVALID]: 400,
    [ErrorCode.MQTT_CONNECTION_ERROR]: 500,
    [ErrorCode.MQTT_PUBLISH_ERROR]: 500,
    [ErrorCode.MQTT_SUBSCRIPTION_ERROR]: 500,
    // InfluxDB hataları
    [ErrorCode.INFLUXDB_CONNECTION_ERROR]: 500,
    [ErrorCode.INFLUXDB_QUERY_ERROR]: 500,
    [ErrorCode.INFLUXDB_WRITE_ERROR]: 500,
    // Dış API ve servis hataları
    [ErrorCode.EXTERNAL_API_ERROR]: 502,
    [ErrorCode.SERVICE_UNAVAILABLE]: 503,
    [ErrorCode.TIMEOUT_ERROR]: 504,
    // İş mantığı hataları
    [ErrorCode.BUSINESS_RULE_VIOLATION]: 400,
    [ErrorCode.INVALID_OPERATION]: 400,
    // Dosya işlemleri hataları
    [ErrorCode.FILE_NOT_FOUND]: 404,
    [ErrorCode.FILE_TOO_LARGE]: 413,
    [ErrorCode.INVALID_FILE_TYPE]: 400,
    [ErrorCode.FILE_READ_ERROR]: 500,
    [ErrorCode.FILE_WRITE_ERROR]: 500,
    // Kullanıcı ve yetki hataları
    [ErrorCode.USER_NOT_FOUND]: 404,
    [ErrorCode.USER_ALREADY_EXISTS]: 409,
    [ErrorCode.INVALID_ROLE]: 400,
    [ErrorCode.ROLE_NOT_ALLOWED]: 403
};
