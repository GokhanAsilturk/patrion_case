#!/bin/sh

echo "Veritabanının hazır olmasını bekliyorum..."

# PostgreSQL'in hazır olmasını bekle - network kontrolü
while ! nc -z postgres 5432; do
  echo "PostgreSQL servisi henüz hazır değil (port kontrolü) - bekleniyor..."
  sleep 1
done
echo "PostgreSQL portu açık!"

# PostgreSQL'in gerçekten kullanılabilir olduğunu kontrol et
max_retries=30
counter=0
while ! pg_isready -h postgres -p 5432 -U postgres; do
  echo "PostgreSQL servisi henüz hazır değil (pg_isready kontrolü) - bekleniyor..."
  sleep 2
  counter=$((counter + 1))
  if [ $counter -ge $max_retries ]; then
    echo "PostgreSQL servisi $max_retries denemeden sonra hala hazır değil - devam ediliyor..."
    break
  fi
done

# Veritabanının gerçekten bağlanabilir olduğunu kontrol et
echo "Veritabanı bağlantısını test ediliyor..."
counter=0
while ! node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: 'postgres',
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err);
    process.exit(1);
  }
  console.log('Veritabanı bağlantısı başarılı!');
  pool.end();
  process.exit(0);
});" 2>/dev/null; do
  echo "Veritabanına bağlantı sağlanamıyor - bekleniyor..."
  sleep 3
  counter=$((counter + 1))
  if [ $counter -ge 10 ]; then
    echo "Veritabanına bağlantı başarısız oldu, ancak devam ediliyor..."
    break
  fi
done

echo "Tüm kontroller tamamlandı. Uygulama başlatılıyor..."
# Ana uygulamayı başlat
npm start
