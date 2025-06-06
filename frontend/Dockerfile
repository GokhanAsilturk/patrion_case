FROM node:18-alpine

# Çalışma dizinini oluştur
WORKDIR /usr/src/app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Bu satırı docker-compose'dan inject edilen ENV değişkenlerini build sırasında kullanılabilir yapmak için ekledik
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Next.js uygulamasını build et
RUN npm run build

# Uygulama için gerekli portu aç
EXPOSE 4001
ENV PORT=4001

# Uygulamayı başlat
CMD ["npm", "start"]
