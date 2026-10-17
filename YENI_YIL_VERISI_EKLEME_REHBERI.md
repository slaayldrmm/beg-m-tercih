# Yeni Yıl / Yeni Dönem Verisi Nasıl Eklenir? Rehberi

ÖSYM yeni bir Sağlık Bakanlığı sözleşmeli sağlık personeli tercih kılavuzu veya yerleştirme sonuç belgesi yayımladığında (örneğin KPSS-2026/1 veya KPSS-2026/5), sisteme yeni veriyi entegre etmek için aşağıdaki 4 basit adımı takip etmeniz yeterlidir.

---

### Adım 1: Resmi PDF Dosyalarını İndirin ve `/data/raw` Klasörüne Ekleyin
ÖSYM'nin resmi internet sitesinden (`osym.gov.tr`) iki belgeyi indirin:
1. **Tercih Kılavuzu Tablo 3 (Lisans):** Kadroların, illerin ve kontenjanların listesi (örn: `tablo3_2026_1.pdf`)
2. **Yerleştirme Sonuçları (Lisans Min-Max):** Taban ve tavan puanların listesi (örn: `minmax_2026_1.pdf`)

Bu iki PDF dosyasını projenin `data/raw/` dizinine kopyalayın.

---

### Adım 2: `scripts/parse_data.py` Dosyasındaki `PERIODS` Listesine Yeni Dönemi Ekleyin
[`scripts/parse_data.py`](file:///c:/Users/slaay/Desktop/begüm%20tercih/scripts/parse_data.py) dosyasını açın ve `PERIODS` dizisine yeni dönemin bilgilerini ekleyin:

```python
PERIODS = [
    # Mevcut dönemler...
    {
        "year": 2026,
        "donem": "2026/1",
        "tablo3_file": "tablo3_2026_1.pdf",
        "minmax_file": "minmax_2026_1.pdf",
        "official_guide_name": "KPSS-2026/1 Tercih Kılavuzu (Tablo 3)",
        "official_result_name": "KPSS-2026/1 Yerleştirme Sonuçları (Lisans)"
    }
]
```

---

### Adım 3: Veri Boru Hattı Scriptini Çalıştırın
Terminalde şu komutu çalıştırarak tüm PDF'leri yeniden ayrıştırın:

```bash
python scripts/parse_data.py
```

Bu script otomatik olarak:
- Yeni PDF'deki verileri ayrıştırır ve standartlara göre normalize eder.
- `data/processed/placements.json` ana tablosunu günceller.
- `data/processed/nurse_lisans.json` dosyasını günceller.
- 81 ilin taban puan ve kontenjan özetini içeren `data/processed/provinces_summary.json` dosyasını yeniden hesaplar.
- Rastgele 10 satırlık doğrulama raporunu (`validation_report.md`) yeniler.

---

### Adım 4: İşlenmiş Verileri Web Uygulamasına Kopyalayın ve Derleyin
Üretilen JSON dosyalarını web uygulamasının veri dizinine kopyalayın:

```bash
# Windows PowerShell için:
Copy-Item -Path "data\processed\*" -Destination "kpss-asistan\src\data\" -Force

# Web uygulamasını yeniden derleyin:
cd kpss-asistan
npm run build
```

Yeni döneme ait tüm taban puanlar, il grafikleri, harita renklendirmeleri ve kontenjanlar web sitesinde anında güncellenmiş olarak yayına hazır hale gelecektir.
