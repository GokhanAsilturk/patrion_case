FROM node:18-alpine

# Çalışma dizinini oluştur
WORKDIR /usr/src/app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Bağlantı kontrolü için gerekli araçları yükle
RUN apk add --no-cache netcat-openbsd postgresql-client

# Kaynak kodları kopyala
COPY . .

# TypeScript'i JavaScript'e derle
RUN npm run build

# Başlangıç betiğine yürütme izni ver
COPY start.sh .
RUN chmod +x start.sh

# Uygulama için gerekli portu aç
EXPOSE 4000
ENV PORT=4000

# Uygulamayı başlat
CMD ["./start.sh"]