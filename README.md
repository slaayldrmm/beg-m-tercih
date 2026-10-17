# KPSS Sağlık Bakanlığı Yerleştirme Asistanı

Sağlık Bakanlığı'nın KPSS ile yaptığı sözleşmeli sağlık personeli alımına (**ilk hedef kadro: Hemşire, Lisans**) başvuracak adayların; KPSS puanlarına göre hangi illere yerleşebileceklerini geçmiş yıl resmi verilerine bakarak görmesini, akıllı tercih listesi hazırlamasını, liste risk dengesini analiz etmesini ve atama sürecini takip etmesini sağlayan modern, mobil öncelikli ve Türkçe web uygulaması.

---

## 🚀 Özellikler

1. **Puan Analizi & Risk Sınıflandırması:**
   - Adayın KPSS Lisans P3 puanını son 3 dönemin (2024/5, 2025/4, 2025/5) taban puanlarıyla kıyaslar.
   - Sınıflandırma: 🟢 **Güvenli** | 🟡 **Olası** | 🟠 **Riskli** | 🔴 **Düşük İhtimal**.
2. **İnteraktif Türkiye Haritası & Zengin Tablo:**
   - 81 ilin tamamını kapsayan ölçeklenebilir interaktif SVG haritası ve dinamik veri tablosu.
   - Bölge bazlı ve kategori bazlı filtreleme, anlık il arama.
3. **Senaryo Simülasyonu:**
   - Yeni atamadaki olası kontenjan değişimleri (%-30 ile %+30) ve aday yığılması rekabet katsayısı kaydırıcılarıyla canlı taban puan tahmini.
4. **İl Detay Sayfaları (`/il/[slug]`):**
   - 81 ilin her biri için son 3 döneme ait taban/tavan puan grafikleri, kontenjan değişimleri ve hastane/TSM/aile hekimliği bazında detaylı yerleştirme dökümü.
5. **Akıllı Tercih Listesi & Denge Analizi (`/tercih-listesi`):**
   - 30 tercihe kadar sürükle-bırak (Drag & Drop) ve mobilde dokunmatik yukarı/aşağı butonlarıyla sıralama.
   - Açıkta kalma riskini ölçen yapay zeka destekli Denge Analiz Skoru (Örn: "Hiç güvenli tercih yok" uyarısı).
   - Tarayıcı içi doğrudan A4 temiz PDF / Yazdırma desteği (`window.print`).
6. **Şehir Karşılaştırma Modülü (`/karsilastir`):**
   - 2 veya 3 ili yan yana koyarak taban puanları ve kontenjanları kıyaslama.
   - Kullanıcının kendi doldurabildiği kira tahmini, nöbet yoğunluğu ve yakınlık notları (Uydurma veri konmaz, tamamen kullanıcının cihazında saklanır).
7. **Atama Takvimi & Evrak Kontrol Listesi (`/takvim-ve-evraklar`):**
   - Yönetilebilir takvim JSON'u ve işaretlenebilir interaktif resmi evrak kontrol listesi (% tamamlanma çubuğu ile).
8. **Tam Veri Gizliliği:**
   - Backend ve veritabanı yoktur; kullanıcı puanları ve tercih listesi yalnızca tarayıcıda (`localStorage`) saklanır, sunucuya hiçbir veri gönderilmez.

---

## 🛠️ Teknik Yığın

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Veri Boru Hattı:** Python 3 (pdfplumber, pandas)
- **Veri Depolama:** Statik optimize edilmiş JSON dosyaları (`src/data/`)
- **İkonlar:** Saf, ultra hafif SVG bileşenleri (`src/components/icons.tsx`)
- **Testler:** Node.js yerleşik test koşucusu (`node:test`) ile 13 birim testi

---

## 📦 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+ (Node v20 veya v22 önerilir)
- Python 3.9+ (Yalnızca yeni PDF verisi ayrıştırılacaksa gereklidir)

### Geliştirme Ortamı (Development)
```bash
# Proje dizinine geçiş
cd kpss-asistan

# Bağımlılıkları yükleyin (ilk seferde)
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```
Uygulama `http://localhost:3000` adresinde çalışacaktır.

### Üretim Derlemesi (Production Build)
```bash
cd kpss-asistan
npm run build
npm start
```
Vercel'e doğrudan deploy edilebilir (`kpss-asistan` kök dizin olarak tanımlanabilir).

### Birim Testlerini Çalıştırma
```bash
cd kpss-asistan
npx tsx --test src/lib/prediction.test.mjs
```

---

## 📁 Dizin Yapısı

```
├── data/
│   ├── raw/                  # ÖSYM'den indirilen ham resmi PDF belgeleri
│   ├── processed/            # Python ile ayrıştırılmış normalize JSON çıktıları
│   └── README.md             # Veri sözlüğü ve kolon açıklamaları
├── config/
│   └── profession_filter.json# Kadro hedefi ve unvan normalizasyon eşleme haritası
├── scripts/
│   └── parse_data.py         # 6 PDF'i parse eden ana veri hattı motoru
├── kpss-asistan/             # Next.js web uygulaması
│   ├── src/
│   │   ├── app/              # Next.js App Router sayfaları
│   │   │   ├── page.tsx      # Ana sayfa (Puan girişi & istatistikler)
│   │   │   ├── nereye-yerlesirim/ # İller tablosu ve Türkiye SVG haritası
│   │   │   ├── il/[slug]/    # 81 ilin detay sayfaları
│   │   │   ├── tercih-listesi/    # Tercih listesi & denge analizi
│   │   │   ├── karsilastir/  # Şehir kıyaslama modülü
│   │   │   ├── takvim-ve-evraklar/# Takvim ve evrak checklist
│   │   │   └── yontem/       # Metodoloji & şeffaflık
│   │   ├── components/       # UI bileşenleri (TurkeyMap, Navbar, Footer, Icons)
│   │   ├── config/           # Takvim, evrak ve tahmin eşikleri konfigürasyonu
│   │   ├── data/             # Web uygulamasına gömülü optimize JSON'lar
│   │   ├── lib/              # Tahmin motoru ve birim testler
│   │   └── types/            # TypeScript veri modelleri
```

---

## 📜 Yasal Uyarı
Bu platform bağımsız bir açık kaynak projesidir; ÖSYM veya T.C. Sağlık Bakanlığı'nın resmi internet sitesi değildir. Sunulan tüm tahminler ve marj bantları geçmiş yıl yerleştirme verilerine dayalı projeksiyonlardır, yerleşme garantisi vermez. Adayların resmi tercih kılavuzunu incelemesi zorunludur.
