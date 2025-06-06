import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import config from './config/config';
import routes from './routes';
import { initMqttClient } from './services/mqtt.service';
import { initSocketIO } from './socket';
import { createUsersTable } from './models/user.model';
import { createCompaniesTable } from './models/company.model';
import { createSensorsTable, createSensorDataTable } from './models/sensor.model';
import { createUserLogsTable } from './models/log.model';
import { httpLogger } from './middlewares/logger.middleware';
import { log } from './utils/logger';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './utils/swagger';
import seedDatabase from './seeds/seed';
import { standardRateLimiter, strictRateLimiter } from './middlewares/rate-limiter.middleware';
import { initInfluxDB } from './services/influxdb.service';
// Hata yakalama middleware'lerini içe aktar
import { 
  notFoundHandler, 
  validationErrorHandler, 
  postgresErrorHandler, 
  jwtErrorHandler, 
  unexpectedErrorHandler, 
  globalErrorHandler 
} from './middlewares/error.middleware';

// Environment variables
dotenv.config();

// Express uygulaması
const app: Application = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(httpLogger);

// Global rate limiter - tüm API'ler için
app.use(standardRateLimiter);

// Initialize database tables with retry mechanism
const initDatabase = async (retries = 3, delay = 3000) => {
  let attempts = 0;
  
  // Table creation retry loop
  while (attempts < retries) {
    try {
      log.info(`Veritabanı tablolarını oluşturma denemesi: ${attempts + 1}/${retries}`);
      
      // İlk önce şirket tablosunu oluştur (users tablosu company_id foreign key için buna bağlı)
      await createCompaniesTable();
      log.info('Şirket tablosu başarıyla oluşturuldu');
      
      // Sonra kullanıcı tablosunu oluştur (bu tabloda company_id foreign key'i var)
      await createUsersTable();
      log.info('Kullanıcı tablosu başarıyla oluşturuldu');
      
      // Sensör tablolarını oluştur
      await createSensorsTable();
      log.info('Sensör tablosu başarıyla oluşturuldu');
      
      await createSensorDataTable();
      log.info('Sensör veri tablosu başarıyla oluşturuldu');
      
      // Son olarak log tablosunu oluştur
      await createUserLogsTable();
      log.info('Kullanıcı log tablosu başarıyla oluşturuldu');
      
      log.info('Veritabanı tabloları başarıyla oluşturuldu');
      break; // Başarılı olunca döngüden çık
    } catch (error) {
      attempts++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      log.error('Veritabanı tabloları oluşturulurken hata', { 
        error: errorMessage,
        attempt: attempts,
        remainingRetries: retries - attempts
      });
      console.error(`Veritabanı hata (Deneme ${attempts}/${retries}):`, errorMessage);
      
      if (attempts >= retries) {
        log.error('Maksimum yeniden deneme sayısına ulaşıldı, tablo oluşturma başarısız');
        break;
      }
      
      log.info(`${delay/1000} saniye sonra tablolar yeniden oluşturulmayı deneyecek...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Seed data retry loop - separate from table creation
  attempts = 0;
  while (attempts < retries) {
    try {
      log.info(`Seed verilerini ekleme denemesi: ${attempts + 1}/${retries}`);
      await seedDatabase();
      log.info('Seed verileri başarıyla eklendi');
      break; // Başarılı olunca döngüden çık
    } catch (error) {
      attempts++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      log.error('Seed verileri ekleme hatası', { 
        error: errorMessage,
        attempt: attempts,
        remainingRetries: retries - attempts
      });
      console.error(`Seed verileri ekleme hatası (Deneme ${attempts}/${retries}):`, errorMessage);
      
      if (attempts >= retries) {
        log.error('Maksimum yeniden deneme sayısına ulaşıldı, seed verileri ekleme başarısız');
        break;
      }
      
      log.info(`${delay/1000} saniye sonra seed verileri yeniden eklenmeyi deneyecek...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// API Routes
app.use('/api', routes);
console.log('API rotaları yüklendi, /api/logs endpoint\'i aktif');

// Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Ana sayfa
app.get('/', (req: Request, res: Response) => {
  res.redirect('/api-docs');
});

// Hata yakalama middleware'leri
// 404 handler - rotalardan sonra eklenir
app.use(notFoundHandler);

// Express hata middleware'leri 4 parametre alır (err, req, res, next)
app.use(validationErrorHandler as express.ErrorRequestHandler);
app.use(postgresErrorHandler as express.ErrorRequestHandler);
app.use(jwtErrorHandler as express.ErrorRequestHandler);
app.use(unexpectedErrorHandler as express.ErrorRequestHandler);

// Global error handler - en son çalışacak
app.use(globalErrorHandler as express.ErrorRequestHandler);

// HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

// Sunucuyu kapatmak için fonksiyon
export const closeServer = () => {
  if (server) {
    server.close();
  }
};

// Sunucuyu başlatmak için fonksiyon
export const startServer = async () => {
  return new Promise<void>((resolve) => {
    server.listen(PORT, async () => {
      log.info(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
      
      // Initialize database tables
      await initDatabase();
      
      // Initialize MQTT client
      initMqttClient();
      
      // Initialize InfluxDB client
      initInfluxDB();
      
      resolve();
    });
  });
};

// Test ortamında değilsek sunucuyu başlat
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Handle process termination
process.on('SIGTERM', () => {
  log.info('SIGTERM sinyali alındı. Sunucu kapatılıyor.');
  server.close(() => {
    log.info('HTTP sunucusu kapatıldı.');
    process.exit(0);
  });
});

export default server; 