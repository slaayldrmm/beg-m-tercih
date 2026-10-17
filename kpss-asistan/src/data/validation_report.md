# Veri Doğrulama Raporu (10 Rastgele Örnek)

Bu rapor, ayrıştırma motorunun ürettiği `placements.json` ve `nurse_lisans.json` dosyalarından rastgele seçilen 10 adet Hemşire (Lisans) satırını resmi PDF kaynaklarıyla karşılaştırarak doğrular.

| No | Dönem | ÖSYM Kodu | İl | Kurum Adı | Kontenjan | Min Puan | Max Puan | Kontenjan Türü | Doğrulama |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 2024/5 | `305014770` | BURSA | T.C. SAĞLIK BAKANLIĞI GEMLİK DEVLET HAST... | 19 | 72.80594 | 79.31002 | Genel | ✅ DOĞRULANDI |
| 2 | 2024/5 | `305012796` | ARDAHAN | T.C. SAĞLIK BAKANLIĞI ÇILDIR İLÇE DEVLET... | 3 | 70.28268 | 70.6194 | Genel | ✅ DOĞRULANDI |
| 3 | 2025/4 | `304022974` | VAN | VAN BAŞKALE İLÇE SAĞLIK MÜDÜRLÜĞÜ... | 2 | 85.34731 | 87.30823 | İlçe Sağlık Müdürlüğü | ✅ DOĞRULANDI |
| 4 | 2025/4 | `304014112` | ELAZIĞ | T.C. SAĞLIK BAKANLIĞI KARAKOÇAN DEVLET H... | 2 | 88.6661 | 90.37723 | Genel | ✅ DOĞRULANDI |
| 5 | 2025/4 | `304013699` | ÇORUM | T.C. SAĞLIK BAKANLIĞI ALACA DEVLET HASTA... | 3 | 83.87907 | 88.03468 | Genel | ✅ DOĞRULANDI |
| 6 | 2024/5 | `305024563` | ORDU | T.C. SAĞLIK BAKANLIĞI MESUDİYE İLÇE DEVL... | 7 | 69.18645 | 69.97518 | Genel | ✅ DOĞRULANDI |
| 7 | 2024/5 | `305013356` | BALIKESİR | BALIKESİR HAVRAN TOPLUM SAĞLIĞI MERKEZİ... | 1 | 80.93843 | 80.93843 | Toplum Sağlığı Merkezi | ✅ DOĞRULANDI |
| 8 | 2024/5 | `305023660` | MERSİN | T.C. SAĞLIK BAKANLIĞI GÜLNAR DEVLET HAST... | 1 | 82.7728 | 82.7728 | Genel | ✅ DOĞRULANDI |
| 9 | 2025/5 | `305024395` | TEKİRDAĞ | TEKİRDAĞ SARAY İLÇE SAĞLIK MÜDÜRLÜĞÜ TEK... | 1 | 82.76018 | 82.76018 | Aile Hekimliği (663 KHK 45/A) / İlçe Sağlık Müdürlüğü | ✅ DOĞRULANDI |
| 10 | 2024/5 | `305027965` | ZONGULDAK | T.C. SAĞLIK BAKANLIĞI ZONGULDAK KADIN DO... | 4 | 70.86182 | 71.85326 | Genel | ✅ DOĞRULANDI |

## Normalizasyon Eşleme Kuralları
- **Lisans Düzeyi Garantisi:** Yalnızca Lisans kılavuz ve sonuç belgeleri işlenmiş olup lisans dışı kadrolar dahil edilmemiştir.
- **Unvan Standardı:** `HEMRE`, `HEMSIRE` -> `HEMŞİRE` olarak normalize edilmiştir.
- **İl Standardı:** 81 resmi il adına haritalanmıştır. Kurum adındaki `/ İL /` belirteçleri doğrulanmıştır.
- **Kontenjan Türleri:** Şehir Hastaneleri, TSM'ler, 663 KHK 45/A Aile Hekimliği pozisyonları ve Deprem bölgesi satırları ayrı etiketlenmiştir.