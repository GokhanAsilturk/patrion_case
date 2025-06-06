"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000,
    nodeEnv: (_b = process.env.NODE_ENV) !== null && _b !== void 0 ? _b : 'development',
    db: {
        host: (_c = process.env.DB_HOST) !== null && _c !== void 0 ? _c : 'localhost',
        port: parseInt((_d = process.env.DB_PORT) !== null && _d !== void 0 ? _d : '5432', 10),
        user: (_e = process.env.DB_USER) !== null && _e !== void 0 ? _e : 'postgres',
        password: (_f = process.env.DB_PASSWORD) !== null && _f !== void 0 ? _f : '1234',
        database: (_g = process.env.DB_NAME) !== null && _g !== void 0 ? _g : 'patrion_case',
    },
    jwt: {
        secret: (_h = process.env.JWT_SECRET) !== null && _h !== void 0 ? _h : 'patrion_jwt_secret_key',
        expiresIn: (_j = process.env.JWT_EXPIRES_IN) !== null && _j !== void 0 ? _j : '1d',
    },
    mqtt: {
        broker: (_k = process.env.MQTT_BROKER) !== null && _k !== void 0 ? _k : 'mqtt://localhost:1883',
        clientId: (_l = process.env.MQTT_CLIENT_ID) !== null && _l !== void 0 ? _l : 'sensor_tracking_server',
        username: (_m = process.env.MQTT_USERNAME) !== null && _m !== void 0 ? _m : '',
        password: (_o = process.env.MQTT_PASSWORD) !== null && _o !== void 0 ? _o : ''
    },
    influxdb: {
        url: (_p = process.env.INFLUX_URL) !== null && _p !== void 0 ? _p : 'http://localhost:8086',
        token: (_q = process.env.INFLUX_TOKEN) !== null && _q !== void 0 ? _q : 'mCjO945P8QqKpYoLTcMpqovvVRjIzMWNH52u6PgRR9yRYrMXs5YGAPgTJ-_NfuLC9wf6ADVLBKIUacw7UTxVHw==',
        org: (_r = process.env.INFLUX_ORG) !== null && _r !== void 0 ? _r : 'sensor_org',
        bucket: (_s = process.env.INFLUX_BUCKET) !== null && _s !== void 0 ? _s : 'sensor_data'
    }
};
exports.default = config;
