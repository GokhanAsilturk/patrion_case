# Frontend Geliştirme Yol Haritası - Sensör İzleme Platformu

## 1. Genel Bakış

Backend API incelemesine göre, sensör verilerini gerçek zamanlı izleyen, kullanıcı ve şirket yönetimi yapan, log kayıtlarını görüntüleyen bir monitoring platformu geliştireceğiz. Frontend, aşağıdaki ana modüllerden oluşacak:

- **Kimlik Doğrulama ve Kullanıcı Yönetimi**
- **Şirket Yönetimi**
- **Sensör İzleme ve Analiz**
- **Gerçek Zamanlı Gösterge Panelleri**
- **Log Yönetimi ve Sistem İzleme**
- **Bildirim Merkezi**

## 2. Proje Yapılandırması

### Gereksinimler

- [✓] React veya Next.js (SSR için)
- [✓] TypeScript
- [✓] Socket.IO Client (gerçek zamanlı veri için)
- [✓] State Yönetimi: Redux veya Context API
- [✓] Grafik Kütüphaneleri: Chart.js veya D3.js
- [✓] UI Kütüphanesi: Material UI, Ant Design veya Tailwind CSS
- [✓] Form Yönetimi: Formik veya React Hook Form
- [✓] HTTP Client: Axios

### Proje Mimarisi

```
src/
├── api/                 # API istekleri
├── assets/              # Statik dosyalar
├── components/          # Paylaşılan componentler
├── contexts/            # React contextleri
├── hooks/               # Custom hooklar
├── layouts/             # Sayfa layoutları
├── pages/               # Sayfa componentleri
├── redux/               # State yönetimi (Redux kullanılacaksa)
├── services/            # Servisler (Socket.IO, localStorage vb.)
├── types/               # TypeScript tipleri
└── utils/               # Yardımcı fonksiyonlar
```

## 3. Adım Adım Geliştirme Planı

### Aşama 1: Temel Altyapı ve Kimlik Doğrulama (1-2 Hafta)

1. **Proje Kurulumu**
   - [✓] React/Next.js projesi oluşturma
   - [✓] TypeScript yapılandırması
   - [✓] Linting ve formatlama ayarları
   - [✓] Routing yapısı

2. **Kimlik Doğrulama**
   - [✓] Giriş sayfası (Login formu)
   - [✓] JWT token yönetimi
   - [✓] Auth context/redux store 
   - [✓] Route koruması (ProtectedRoute bileşeni)
   - [✓] Rol tabanlı erişim yönetimi

3. **Temel Layouts**
   - [✓] Ana layout (header, sidebar, content, footer)
   - [✓] Navigasyon menüsü
   - [✓] Responsive tasarım

### Aşama 2: Kullanıcı ve Şirket Yönetimi (1 Hafta)

1. **Kullanıcı Yönetimi**
   - [ ] Kullanıcı listesi
   - [ ] Kullanıcı profili
   - [ ] Kullanıcı oluşturma/düzenleme formları
   - [ ] Şifre değiştirme

2. **Şirket Yönetimi**
   - [ ] Şirket listesi
   - [ ] Şirket detay sayfası
   - [ ] Şirket oluşturma/düzenleme formları
   - [ ] Şirket sensörlerini görüntüleme

### Aşama 3: Sensör İzleme ve Analiz (2 Hafta)

1. **Sensör Listesi ve Detayları**
   - [ ] Sensör listesi sayfası
   - [ ] Sensör detay sayfası
   - [ ] Sensör durumu göstergeleri

2. **Sensör Verileri ve Grafikler**
   - [ ] Zaman serisi grafikleri
   - [ ] Veri filtreleme (tarih aralığı, sensör türü)
   - [ ] Analitik panelleri (min, max, ortalama vb.)
   - [ ] Veri dışa aktarma (CSV, Excel)

3. **Sensör Haritası**
   - [ ] Sensörlerin konum bazlı gösterimi (opsiyonel)
   - [ ] Harita üzerinde sensör durumu görüntüleme

### Aşama 4: Gerçek Zamanlı İzleme ve Socket.IO (1 Hafta)

1. **Socket.IO Entegrasyonu**
   - [✓] WebSocket bağlantı yönetimi
   - [✓] Odaları dinleme (sensör ve şirket odaları)
   - [✓] Sensör veri akışını yönetme
   - [✓] Bağlantı hatalarını işleme

2. **Gerçek Zamanlı Gösterge Panelleri**
   - [✓] Canlı sensör göstergeleri
   - [ ] Veri değişimini gösterme animasyonları
   - [ ] Anlık alertler ve bildirimler

### Aşama 5: Log Yönetimi ve Sistem İzleme (1 Hafta)

1. **Log Görüntüleme**
   - [ ] Kullanıcı logları
   - [ ] Sistem logları
   - [ ] Log detayları
   - [ ] Log filtreleme ve arama

2. **Log İstatistikleri**
   - [ ] Log analitikleri grafikleri
   - [ ] Kullanıcı aktivite özetleri

### Aşama 6: Bildirim Sistemi (1 Hafta)

1. **Bildirim Merkezi**
   - [ ] Bildirim listesi
   - [ ] Okunmamış bildirimleri gösterme
   - [ ] Bildirim tipleri (alert, warning, info)

2. **Gerçek Zamanlı Bildirimler**
   - [✓] Socket.IO ile bildirim alma
   - [ ] Masaüstü bildirimleri (browser notifications)
   - [ ] Toast bildirimleri

### Aşama 7: Optimizasyon, Test ve Dağıtım (1-2 Hafta)

1. **Performans Optimizasyonu**
   - [ ] Code splitting
   - [ ] Memoizasyon
   - [ ] Veri önbelleğe alma
   - [ ] Lazy loading

2. **Testler**
   - [ ] Birim testleri
   - [ ] Entegrasyon testleri
   - [ ] E2E testleri

3. **Dağıtım**
   - [ ] Build optimizasyonu
   - [ ] Docker entegrasyonu
   - [ ] Deployment scriptleri

## 4. Frontend - Backend Entegrasyonu Önerisi

Backend projesini inceledikten sonra, frontend için iki yaklaşım bulunmaktadır:

### Ayrı Projeler Yaklaşımı (Önerilen)

- **Avantajlar:**
  - Daha temiz proje yapısı
  - Bağımsız geliştirme ve deployment
  - Ekip içinde frontend ve backend ayrımı daha kolay
  - CI/CD pipeline'ları için daha uygun
  - Frontend'in farklı hosting çözümleri kullanabilmesi (Vercel, Netlify vb.)

- **Dezavantajlar:**
  - CORS yapılandırması gerektirir
  - Ek geliştirme ortamı kurulumu
  - İki ayrı repository yönetimi

### Monolitik Yaklaşım

- **Avantajlar:**
  - Daha basit başlangıç
  - Tek repository yönetimi
  - Development sırasında aynı portta çalışma

- **Dezavantajlar:**
  - Zamanla karmaşıklaşabilir
  - Backend ve frontend'in bağımlılıkları karışabilir
  - Deployment daha karmaşık olabilir

**Öneri:** Projenin sensör izleme gibi kritik ve gerçek zamanlı bir uygulama olduğu göz önüne alındığında, ayrı projeler yaklaşımı daha uygun olacaktır. Bu, frontend'in daha esnek ve ölçeklenebilir olmasını sağlayacaktır.

## 5. Tahmini Zaman Çizelgesi

- **Toplam Süre:** 8-10 hafta
- **Aşama 1:** 1-2 hafta
- **Aşama 2:** 1 hafta
- **Aşama 3:** 2 hafta
- **Aşama 4:** 1 hafta
- **Aşama 5:** 1 hafta
- **Aşama 6:** 1 hafta
- **Aşama 7:** 1-2 hafta

## 6. Özellik Detayları ve Ekran Tanımları

### Kimlik Doğrulama ve Kullanıcı Yönetimi Ekranları
- Giriş Sayfası
- Kullanıcı Profili
- Kullanıcı Listesi (Yönetici için)
- Kullanıcı Oluşturma/Düzenleme Formu
- Şifre Değiştirme Sayfası

### Şirket Yönetimi Ekranları
- Şirket Listesi
- Şirket Detayları
- Şirket Oluşturma/Düzenleme Formu
- Şirket Sensörleri Görünümü

### Sensör İzleme Ekranları
- Ana Dashboard
- Sensör Listesi
- Sensör Detay Sayfası
- Sensör Verileri Grafiği
- Sensör Analitikleri Sayfası

### Log Yönetimi Ekranları
- Log Listesi
- Log Detayları
- Log Analitikleri
- Kullanıcı Aktivite Raporu

### Bildirim Ekranları
- Bildirim Merkezi
- Bildirim Ayarları

## 7. Sonraki Adımlar ve Geliştirme Önerileri

- Çoklu dil desteği (i18n) eklemek
- Tema desteği (Dark/Light mode)
- Offline çalışma modu
- PWA desteği
- Mobil uygulama (React Native ile)
- Daha gelişmiş analitik ve raporlama özellikleri
- E-posta bildirimleri entegrasyonu
- PDF rapor oluşturma

## 8. Backend-Frontend Uyum ve Eksikler (Otomatik Analiz)

### Eksik veya Hatalı Noktalar

- [ ] **Şifre Değiştirme:** Backend'de şifre değiştirme için bir endpoint (örn. PATCH /users/:id/password) eksik. Frontend'deki şifre değiştirme ekranı için backend'e bu endpoint eklenmeli.
- [ ] **Şirket Sensörleri:** Backend'de şirketin sensörlerini getiren bir endpoint (örn. GET /companies/:id/sensors) eksik veya açıkça tanımlı değil. Frontend'de şirket detayında sensörler gösterilecekse bu endpoint eklenmeli.
- [ ] **Şirket Silme:** Backend'de şirket silme (DELETE /companies/:id) endpointi eksik. Frontend'de de silme işlemi için arayüz eklenmeli.
- [ ] **Sensör İzleme ve Analiz:** Frontend'de sensör listesi, detay, zaman serisi grafik, analitik ve harita ekranları eksik. Backend'deki /sensors/:id/timeseries ve /sensors/:id/analytics endpointleri ile entegre edilmeli.
- [ ] **Log Yönetimi:** Frontend'de log listesi, detay, filtreleme ve analitik ekranları eksik. Backend'deki /logs, /logs/actions, /logs/analytics endpointleri ile entegre edilmeli.
- [ ] **Bildirim Merkezi:** Frontend'de bildirim merkezi, toast ve masaüstü bildirimleri eksik. Backend'deki WebSocket ve /sensors/notifications endpointleri ile entegre edilmeli.
- [ ] **API Error Handling:** Frontend'de API hataları için kullanıcıya anlamlı geri bildirimler gösterilmeli.
- [ ] **Pagination, Filtreleme, Arama:** Frontend'de ve backend'de büyük veri setleri için sayfalama, filtreleme ve arama desteği eklenmeli.
- [ ] **TypeScript Tipleri:** Frontend'de tüm API response'ları için tipler güncellenmeli ve backend ile uyumlu olmalı.
- [ ] **Swagger/OpenAPI:** Backend API dökümantasyonu güncel ve erişilebilir olmalı. Frontend geliştirme sırasında referans alınmalı.
- [ ] **Rol Bazlı Menü ve Yetki:** Frontend'de kullanıcı rolüne göre menü ve erişim dinamikleştirilmeli.