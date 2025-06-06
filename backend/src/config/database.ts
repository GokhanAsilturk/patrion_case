import { Pool, PoolClient, QueryResult } from 'pg';
import config from './config';
import { log } from '../utils/logger';

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  client_encoding: 'UTF8'
});

// Bağlantıda hata olursa tüm uygulamayı çökertmek yerine loglama yap
pool.on('error', (err) => {
  log.error('Beklenmeyen veritabanı hatası', { error: err.message });
});

// Test connection with retries
const testConnection = async (retries = 5, delay = 5000) => {
  let client;
  let attempts = 0;
  
  while (attempts < retries) {
    try {
      client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      log.info('Veritabanı bağlantısı başarılı', { 
        timestamp: result.rows[0],
        attempt: attempts + 1
      });
      return true;
    } catch (err) {
      attempts++;
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      
      log.error('Veritabanına bağlanırken hata oluştu', { 
        error: errorMessage,
        attempt: attempts,
        remainingRetries: retries - attempts
      });
      
      if (attempts >= retries) {
        log.error('Maksimum yeniden deneme sayısına ulaşıldı, veritabanı bağlantısı başarısız', {
          totalAttempts: attempts
        });
        return false;
      }
      
      log.info(`${delay/1000} saniye sonra yeniden bağlanmayı deneyecek...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    } finally {
      if (client) client.release();
    }
  }
  
  return false;
};

// Bağlantıyı test et - 5 deneme ve 5 saniye aralıkla
testConnection(5, 5000);

export default pool; 