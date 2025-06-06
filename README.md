# Patrion Full Stack Uygulama

## Docker ile Çalıştırma

Bu proje, hem backend hem de frontend uygulamalarını Docker üzerinde çalıştırmak için yapılandırılmıştır.

### Başlatma

```bash
# Proje ana klasöründen
docker-compose up -d
```

### Erişim Bilgileri

- **Backend API**: http://localhost:4000
- **Frontend Uygulaması**: http://localhost:4001
- **InfluxDB Arayüzü**: http://localhost:8086
- **MQTT Broker**: localhost:1883 (MQTT protokolü)
- **Postgres**: localhost:5432

### Port Bilgileri

| Servis     | Port  |
|------------|-------|
| Frontend   | 4001  |
| Backend    | 4000  |
| PostgreSQL | 5432  |
| InfluxDB   | 8086  |
| MQTT       | 1883  |
| MQTT Web   | 9001  |

## Geliştirme

Her iki projeyi de ayrı ayrı geliştirmek isterseniz, container'ları durdurup kendi ortamınızda çalıştırabilirsiniz:

```bash
# Container'ları durdur
docker-compose down

# Backend için
cd backend
npm install
npm run dev

# Frontend için (ayrı bir terminal)
cd frontend
npm install
npm run dev
```
