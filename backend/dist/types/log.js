"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     UserLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Log kaydının benzersiz ID'si
 *         user_id:
 *           type: integer
 *           description: Logu oluşturan kullanıcının ID'si
 *         action:
 *           type: string
 *           description: Gerçekleştirilen eylem tipi
 *           enum: [viewed_logs, viewed_sensor_data, viewed_user_profile, viewed_company_data, exported_data, imported_data, downloaded_report, added_sensor, updated_sensor, deleted_sensor, sensor_status_change, created_user, updated_user, deleted_user, updated_profile, changed_password, created_company, updated_company, deleted_company, login, logout, failed_login, reset_password, api_request, api_error, invalid_sensor_data]
 *         details:
 *           type: object
 *           description: Eylem hakkında detaylı bilgi içeren JSON verisi
 *         ip_address:
 *           type: string
 *           description: Eylemi gerçekleştiren IP adresi
 *         user_agent:
 *           type: string
 *           description: Kullanıcı tarayıcı/cihaz bilgisi
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Eylemin gerçekleştirildiği zaman
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Log kaydının oluşturulduğu zaman
 *       example:
 *         id: 1
 *         user_id: 2
 *         action: "viewed_logs"
 *         details: {"target_user_id": 3}
 *         ip_address: "192.168.1.1"
 *         user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
 *         timestamp: "2023-06-15T14:30:45.000Z"
 *         createdAt: "2023-06-15T14:30:45.123Z"
 *     LogAnalytics:
 *       type: object
 *       properties:
 *         action:
 *           type: string
 *           description: Log eylem tipi
 *         count:
 *           type: integer
 *           description: Toplam kayıt sayısı
 *         first_activity:
 *           type: string
 *           format: date-time
 *           description: İlk aktivite zamanı
 *         last_activity:
 *           type: string
 *           format: date-time
 *           description: Son aktivite zamanı
 *         unique_users:
 *           type: integer
 *           description: Benzersiz kullanıcı sayısı
 *       example:
 *         action: "viewed_logs"
 *         count: 120
 *         first_activity: "2023-06-10T09:15:20.000Z"
 *         last_activity: "2023-06-15T18:45:30.000Z"
 *         unique_users: 5
 *     UserActivityStats:
 *       type: object
 *       properties:
 *         action:
 *           type: string
 *           description: Log eylem tipi
 *         count:
 *           type: integer
 *           description: Toplam kayıt sayısı
 *         first_activity:
 *           type: string
 *           format: date-time
 *           description: İlk aktivite zamanı
 *         last_activity:
 *           type: string
 *           format: date-time
 *           description: Son aktivite zamanı
 *         ip_addresses:
 *           type: array
 *           items:
 *             type: string
 *           description: Kullanıcının erişim sağladığı benzersiz IP adresleri
 *       example:
 *         action: "viewed_sensor_data"
 *         count: 45
 *         first_activity: "2023-06-12T10:20:30.000Z"
 *         last_activity: "2023-06-15T16:35:40.000Z"
 *         ip_addresses: ["192.168.1.1", "203.0.113.45"]
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogAction = void 0;
/**
 * @swagger
 * components:
 *   schemas:
 *     LogAction:
 *       type: string
 *       enum:
 *         - viewed_logs
 *         - viewed_sensor_data
 *         - viewed_user_profile
 *         - viewed_company_data
 *         - exported_data
 *         - imported_data
 *         - downloaded_report
 *         - added_sensor
 *         - updated_sensor
 *         - deleted_sensor
 *         - sensor_status_change
 *         - created_user
 *         - updated_user
 *         - deleted_user
 *         - updated_profile
 *         - changed_password
 *         - created_company
 *         - updated_company
 *         - deleted_company
 *         - login
 *         - logout
 *         - failed_login
 *         - reset_password
 *         - api_request
 *         - api_error
 *         - invalid_sensor_data
 *       description: Sistemde tanımlı log eylem tipleri
 */
var LogAction;
(function (LogAction) {
    LogAction["VIEWED_LOGS"] = "viewed_logs";
    LogAction["VIEWED_SENSOR_DATA"] = "viewed_sensor_data";
    LogAction["VIEWED_USER_PROFILE"] = "viewed_user_profile";
    LogAction["VIEWED_COMPANY_DATA"] = "viewed_company_data";
    LogAction["EXPORTED_DATA"] = "exported_data";
    LogAction["IMPORTED_DATA"] = "imported_data";
    LogAction["DOWNLOADED_REPORT"] = "downloaded_report";
    LogAction["ADDED_SENSOR"] = "added_sensor";
    LogAction["UPDATED_SENSOR"] = "updated_sensor";
    LogAction["DELETED_SENSOR"] = "deleted_sensor";
    LogAction["SENSOR_STATUS_CHANGE"] = "sensor_status_change";
    LogAction["CREATED_USER"] = "created_user";
    LogAction["UPDATED_USER"] = "updated_user";
    LogAction["DELETED_USER"] = "deleted_user";
    LogAction["UPDATED_PROFILE"] = "updated_profile";
    LogAction["CHANGED_PASSWORD"] = "changed_password";
    LogAction["CREATED_COMPANY"] = "created_company";
    LogAction["UPDATED_COMPANY"] = "updated_company";
    LogAction["DELETED_COMPANY"] = "deleted_company";
    LogAction["LOGIN"] = "login";
    LogAction["LOGOUT"] = "logout";
    LogAction["FAILED_LOGIN"] = "failed_login";
    LogAction["RESET_PASSWORD"] = "reset_password";
    LogAction["API_REQUEST"] = "api_request";
    LogAction["API_ERROR"] = "api_error";
    LogAction["INVALID_SENSOR_DATA"] = "invalid_sensor_data";
    LogAction["PUBLISHED_SENSOR_DATA"] = "published_sensor_data";
    LogAction["SENT_NOTIFICATION"] = "sent_notification";
})(LogAction || (exports.LogAction = LogAction = {}));
